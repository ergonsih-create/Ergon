"""
GRAM-DISHA — Geographic Data Foundation Test Suite
Smart India Hackathon 2026 (Team ERGON)
Unit & integration tests verifying lookups, LGD validation, duplicate detection,
UNKNOWN handling, conflict management, provenance, and engine boundary contracts.
"""

import unittest
from datetime import datetime

from app.domains.geography.schemas import (
    TerritoryType,
    UrbanityClassification,
    RBITierClassification,
    VerificationStatus,
    ValueState,
    DistrictRecord,
    StateReference,
)
from app.domains.geography.service import GeographyService, geography_service
from app.domains.geography.validation import GeographyValidator
from app.domains.geography.engine_interfaces import (
    GeographyEngineInterface,
    UrbanityEngineInterface,
    PMEGPEngineInterface,
    ODOPEngineInterface,
    FeasibilityEngineInterface,
    FinancialEngineInterface,
    DishaAIContextInterface,
)
from app.domains.geography.pipeline import ingestion_pipeline


class TestGeographyFoundation(unittest.TestCase):

    def setUp(self):
        self.service = geography_service

    # 1. State Lookups
    def test_state_lookup_all_states(self):
        states = self.service.get_all_states()
        self.assertEqual(len(states), 36)
        state_types = [s.territory_type for s in states]
        self.assertEqual(state_types.count(TerritoryType.STATE), 28)
        self.assertEqual(state_types.count(TerritoryType.UNION_TERRITORY), 8)

    def test_state_lookup_by_lgd_code(self):
        mh = self.service.get_state_by_lgd_code("27")
        self.assertIsNotNone(mh)
        self.assertEqual(mh.state_name, "Maharashtra")
        self.assertEqual(mh.territory_type, TerritoryType.STATE)

        up = self.service.get_state_by_lgd_code("09")
        self.assertIsNotNone(up)
        self.assertEqual(up.state_name, "Uttar Pradesh")

        delhi = self.service.get_state_by_lgd_code("07")
        self.assertIsNotNone(delhi)
        self.assertEqual(delhi.territory_type, TerritoryType.UNION_TERRITORY)

    def test_state_lookup_by_name(self):
        raj = self.service.get_state_by_name("Rajasthan")
        self.assertIsNotNone(raj)
        self.assertEqual(raj.state_lgd_code, "08")

        ladakh = self.service.get_state_by_name("ladakh")
        self.assertIsNotNone(ladakh)
        self.assertEqual(ladakh.territory_type, TerritoryType.UNION_TERRITORY)

    # 2. District Lookups
    def test_district_lookup_by_lgd_code(self):
        yavatmal = self.service.get_district_by_lgd_code("489")
        self.assertIsNotNone(yavatmal)
        self.assertEqual(yavatmal.district_name, "Yavatmal")
        self.assertEqual(yavatmal.state_name, "Maharashtra")
        self.assertEqual(yavatmal.urbanity_classification, UrbanityClassification.RURAL)
        self.assertTrue(yavatmal.gram_disha_primary_scope)

    def test_district_lookup_by_name(self):
        varanasi = self.service.get_district_by_name("Varanasi")
        self.assertIsNotNone(varanasi)
        self.assertEqual(varanasi.district_lgd_code, "175")
        self.assertEqual(varanasi.state_name, "Uttar Pradesh")

    def test_invalid_district_lookup(self):
        invalid = self.service.get_district_by_lgd_code("999999")
        self.assertIsNone(invalid)

        invalid_name = self.service.get_district_by_name("NonExistentDistrictXYZ")
        self.assertIsNone(invalid_name)

    # 3. Validation & Duplicate Detection
    def test_duplicate_detection_empty_on_valid_dataset(self):
        districts = self.service.search_districts()
        duplicates = GeographyValidator.check_duplicate_records(districts)
        self.assertEqual(len(duplicates), 0, f"Detected unexpected duplicates: {duplicates}")

    def test_duplicate_detection_flags_colliding_lgd(self):
        bad_records = [
            DistrictRecord(
                state_lgd_code="27",
                state_name="Maharashtra",
                district_lgd_code="489",
                district_name="Yavatmal",
                territory_type=TerritoryType.STATE,
                urbanity_classification=UrbanityClassification.RURAL,
            ),
            DistrictRecord(
                state_lgd_code="27",
                state_name="Maharashtra",
                district_lgd_code="489",
                district_name="Yavatmal Fake Clone",
                territory_type=TerritoryType.STATE,
                urbanity_classification=UrbanityClassification.RURAL,
            ),
        ]
        duplicates = GeographyValidator.check_duplicate_records(bad_records)
        self.assertEqual(len(duplicates), 1)
        self.assertIn("Duplicate district_lgd_code '489'", duplicates[0])

    # 4. Urbanity Retrieval & Rules
    def test_urbanity_retrieval(self):
        yavatmal_urb = self.service.get_urbanity_classification("489")
        self.assertEqual(yavatmal_urb["urbanity"], UrbanityClassification.RURAL)
        self.assertTrue(yavatmal_urb["is_rural"])
        self.assertEqual(yavatmal_urb["value_state"], ValueState.SOURCE_DATA)

        nagpur_urb = self.service.get_urbanity_classification("478")
        self.assertEqual(nagpur_urb["urbanity"], UrbanityClassification.URBAN)
        self.assertFalse(nagpur_urb["is_rural"])

    # 5. PMEGP Geographic Context (Separation of Data from Scheme Rules)
    def test_pmegp_geographic_context(self):
        pmegp_yavatmal = self.service.get_pmegp_context("489")
        self.assertTrue(pmegp_yavatmal.is_rural)
        self.assertEqual(pmegp_yavatmal.indicative_special_subsidy_pct, 35.0)
        self.assertEqual(pmegp_yavatmal.indicative_general_subsidy_pct, 25.0)
        self.assertEqual(pmegp_yavatmal.indicative_promoter_margin_pct, 5.0)

        pmegp_nagpur = self.service.get_pmegp_context("478")
        self.assertFalse(pmegp_nagpur.is_rural)
        self.assertEqual(pmegp_nagpur.indicative_special_subsidy_pct, 25.0)
        self.assertEqual(pmegp_nagpur.indicative_general_subsidy_pct, 15.0)
        self.assertEqual(pmegp_nagpur.indicative_promoter_margin_pct, 10.0)

    # 6. ODOP Retrieval & Alignment
    def test_odop_retrieval(self):
        odop_yavatmal = self.service.get_odop_context("489")
        self.assertIn("Cotton", odop_yavatmal.notified_odop_commodity)

        alignment = ODOPEngineInterface.check_odop_alignment("489", "Cotton Ginning & Baling")
        self.assertTrue(alignment["aligned"])
        self.assertEqual(alignment["benefit_eligibility_state"], "REQUIRES_SCHEME_EVALUATION")

    # 7. UNKNOWN Policy Enforcement (CRITICAL: UNKNOWN != 0, False, or NOT_ELIGIBLE)
    def test_unknown_policy_on_missing_district(self):
        unknown_pmegp = self.service.get_pmegp_context("INVALID_CODE")
        self.assertEqual(unknown_pmegp.urbanity, UrbanityClassification.UNKNOWN)
        self.assertEqual(unknown_pmegp.value_state, ValueState.UNKNOWN)

        unknown_odop = self.service.get_odop_context("INVALID_CODE")
        self.assertEqual(unknown_odop.notified_odop_commodity, "UNKNOWN")
        self.assertEqual(unknown_odop.value_state, ValueState.UNKNOWN)

        unknown_rbi = self.service.get_rbi_tier("INVALID_CODE")
        self.assertEqual(unknown_rbi["rbi_tier"], RBITierClassification.UNKNOWN)
        self.assertEqual(unknown_rbi["value_state"], ValueState.UNKNOWN)

        # Confirm UNKNOWN is distinct from boolean false or numeric 0
        self.assertNotEqual(unknown_pmegp.urbanity, False)
        self.assertNotEqual(unknown_pmegp.urbanity, 0)
        self.assertNotEqual(unknown_odop.notified_odop_commodity, 0)

    # 8. Provenance & Versioning
    def test_provenance_and_version(self):
        prov = self.service.get_provenance()
        self.assertEqual(prov.source_id, "SRC_LGD_01")
        self.assertEqual(prov.source_document, "Gram-Disha_India_District_Urbanity_Reference_With_UTs-2.docx")
        self.assertIn("Ministry of Panchayati Raj", prov.source_authority)

        reg = self.service.get_dataset_registry_entry()
        self.assertEqual(reg.dataset_id, "district_urbanity_policy_reference")
        self.assertEqual(reg.version, "1.0.0")

    # 9. Data Quality Report
    def test_quality_report_generation(self):
        report = self.service.get_quality_report()
        self.assertEqual(report.states_count, 28)
        self.assertEqual(report.union_territories_count, 8)
        self.assertEqual(report.duplicate_records_count, 0)
        self.assertEqual(report.missing_lgd_codes_count, 0)
        self.assertTrue(report.validation_passed)
        self.assertGreaterEqual(report.provenance_coverage_pct, 90.0)

    # 10. Engine Boundary Interfaces
    def test_engine_boundary_interfaces(self):
        # Geography Hierarchy Resolution
        res = GeographyEngineInterface.resolve_location_hierarchy("27", "489")
        self.assertTrue(res["is_valid"])
        self.assertEqual(res["district_name"], "Yavatmal")

        # Invalid State-District Hierarchy Check
        bad_res = GeographyEngineInterface.resolve_location_hierarchy("09", "489")  # UP with Yavatmal (MH)
        self.assertFalse(bad_res["is_valid"])
        self.assertEqual(bad_res["hierarchy_level"], "INVALID_RELATIONSHIP")

        # Feasibility Interface
        feas = FeasibilityEngineInterface.get_feasibility_context("489")
        self.assertEqual(feas["status"], "LOADED")
        self.assertTrue(feas["is_rural"])

        # Disha Context Grounding Interface
        disha = DishaAIContextInterface.get_grounding_context("489")
        self.assertTrue(disha["available"])
        self.assertIn("Yavatmal", disha["district_name"])
        self.assertIn("35.0% Special", disha["pmegp_subsidy_tier"])

    # 11. Ingestion Pipeline Execution
    def test_ingestion_pipeline_execution(self):
        result = ingestion_pipeline.run_ingestion()
        self.assertEqual(result["status"], "SUCCESS")
        self.assertEqual(len(result["audit_trail"]), 5)


if __name__ == "__main__":
    unittest.main()
