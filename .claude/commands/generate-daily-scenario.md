---
name: generate-daily-scenario
description: "Generates a complete daily session scenario JSON file for a specific level, week, and session of the Arabic language curriculum at Earth School."
allowed-tools: Read Write Glob
metadata:
  author: earth-school
  version: "1.0"
---

# Generate Daily Scenario

## Inputs
- **level**: 1, 2, or 3
- **week**: 1-12
- **session**: 1 or 2
- **letter**: The Arabic letter for this week (Level 1 perspective)

## Session Patterns

### Level 1 (6 blocks, 45 min total)
1. قراءة القصة (8 min) - Story reading from school library
2. نقاش حول القصة (5 min) - Story discussion
3. نشاط متعلق بالقصة (7 min) - Story-related activity
4. نشاط الوعي الصوتي (10 min) - Phonological awareness with letter of the week
5. نشاط الوعي البصري (8 min) - Visual awareness of letter
6. نشاط فني/خطوط (7 min) - Art/lines pre-writing activity

### Level 2 (5 blocks, 45 min total)
1. قراءة القصة/مجلس القرآن (8 min)
2. نشاط متعلق (7 min)
3. نقاش + كتابة إبداعية (10 min)
4. أنشطة الوعي البصري بمواضع الحرف (10 min)
5. أنشطة دمج الأصوات وتكوين كلمات (10 min)

### Level 3 - Pattern A (4 blocks, 45 min) - Use for session 1
1. قراءة المعلمة للقصة (10 min)
2. نقاش عن القصة (8 min)
3. كتابة إبداعية (15 min)
4. نشاط لغوي (12 min)

### Level 3 - Pattern B (3 blocks, 45 min) - Use for session 2
1. قراءة تشاركية/ثنائيات (15 min)
2. دراما عن مفهوم في القصة (15 min)
3. نشاط لغوي (15 min)

## Output JSON Schema
```json
{
  "id": "L{level}-W{week}-S{session}",
  "level": 1,
  "week": 1,
  "session": 1,
  "letter": "ا",
  "totalDuration": 45,
  "blocks": [
    {
      "order": 1,
      "title": "قراءة القصة",
      "duration": 8,
      "type": "story",
      "description": "وصف مختصر للنشاط",
      "steps": ["خطوة 1", "خطوة 2"],
      "tips": ["نصيحة للمعلمة"],
      "materials": ["المادة 1"],
      "activityRef": null
    }
  ]
}
```

## Rules
- Session 1 introduces new concepts; Session 2 reinforces and reviews
- Always reference that stories come from the school library (not invented)
- Include specific, actionable teacher instructions
- Materials must be realistic for a nursery setting
- Tips should address common challenges with the age group
- All text in Arabic
- Level 3: Session 1 uses Pattern A, Session 2 uses Pattern B
