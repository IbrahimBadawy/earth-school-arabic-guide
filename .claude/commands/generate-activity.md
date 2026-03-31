---
name: generate-activity
description: "Generates a complete activity entry for the Arabic language activities library with steps, materials, variations, and differentiation tips."
allowed-tools: Read Write Glob
metadata:
  author: earth-school
  version: "1.0"
---

# Generate Activity

## Inputs
- **name**: Activity name in Arabic
- **targetSkill**: phonological | visual | pre-writing | reading | writing | language | drama
- **targetLevels**: Array of levels [1], [1,2], [2,3], etc.

## Output JSON Schema
```json
{
  "id": "act-{number}",
  "name": "اسم النشاط",
  "targetSkill": "phonological",
  "targetLevels": [1, 2],
  "duration": 10,
  "groupSize": "فردي/ثنائي/مجموعة صغيرة/المجموعة كاملة",
  "materials": ["المادة 1", "المادة 2"],
  "description": "وصف مختصر للنشاط وهدفه",
  "steps": ["خطوة 1", "خطوة 2", "خطوة 3"],
  "variations": ["تنويع 1", "تنويع 2"],
  "differentiationTips": {
    "easier": "تبسيط للأطفال الأصغر",
    "harder": "تحدي إضافي للأطفال المتقدمين"
  },
  "tags": ["وعي صوتي", "حركي", "جماعي"]
}
```

## Rules
- Activities must be age-appropriate (3-6 years)
- Steps should be clear enough for any teacher to follow
- Materials must be commonly available in nursery settings
- Include at least 2 variations
- Differentiation tips must address both easier and harder versions
- All text in Arabic
- Islamic values should be reflected where appropriate
