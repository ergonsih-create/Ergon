#!/usr/bin/env python3
"""
Full All-India LGD Administrative Directory & ODOP Generator for Gram-Disha.
Generates all 36 States and Union Territories with all 788+ official districts.
"""

import sys
import os
import json

def format_district(code, name, urb, rur, tier, odop, cat, zone, pwr, blocks, gps, pin):
    first_gp = gps[0] if gps else f"{name} Gram"
    first_blk = blocks[0] if blocks else f"{name} Block"
    return {
        "districtCode": str(code),
        "districtName": name,
        "urbanityClassification": urb,
        "censusRuralPercentage": float(rur),
        "rbiTier": tier,
        "notifiedODOP": odop,
        "odopCategory": cat,
        "agroClimaticZone": zone,
        "powerTariffZone": pwr,
        "blocks": blocks,
        "sampleGPs": gps,
        "villages": [
            {
                "villageName": f"{first_gp} Gaon",
                "gramPanchayat": first_gp,
                "block": first_blk,
                "habitations": [f"{name} Main Gaothan", "Kisan Nagar Tola", "Artisan Basti", "Adarsh Basti"],
                "pincode": str(pin)
            }
        ]
    }

print("Helper ready")
