---
name: generate-assessment
description: "Generates assessment rubrics, placement criteria, and progress tracking templates for the Arabic language curriculum."
allowed-tools: Read Write Glob
metadata:
  author: earth-school
  version: "1.0"
---

# Generate Assessment

## Inputs
- **type**: placement | rubric | progress | checklist
- **level**: 1, 2, or 3
- **domain**: phonological | visual | pre-writing | reading | writing | language (optional, for rubric type)

## Proficiency Levels (for rubrics)
1. مبتدئ - يحتاج دعم مستمر
2. نامٍ - يتقدم بتوجيه
3. مُتقن - يؤدي باستقلالية
4. متقدم - يتجاوز التوقعات

## Output varies by type - generate appropriate JSON structure

## Rules
- Assessment methods must be observation-based (no written tests for this age)
- Use positive, growth-oriented language
- Include specific behavioral indicators
- All text in Arabic
- Age-appropriate expectations
- Islamic educational values reflected
