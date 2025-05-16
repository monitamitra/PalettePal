"use client";

const moods = ['relaxed', 'happy', 'focused', 'sad', 'inspired', 'anxious', 
                  'bored','romantic', 'energetic', 'nostalgic', 'frustrated', 
                  'lonely', 'calm','playful', 'creative']

const skillLevels = ["beginner", "intermediate", "advanced"]

export default function MoodSkillSelector({
  selectedMood,
  setMood,
  selectedSkill,
  setSkill,

}: {
  selectedMood: string;
  setMood: (val: string) => void;
  selectedSkill: string;
  setSkill: (val: string) => void;
}) {
    return (
        <div className="w-sm flex justify-center gap-8 mb-6 border px-4 py-4 
            rounded-md mx-auto bg-white">
            
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Mood</label>
                <select
                value={selectedMood}
                onChange={(e) => setMood(e.target.value)}
                className="border border-black-300 rounded px-3 py-3 text-sm cursor-pointer">
                {moods.map((mood) => (
                    <option key={mood} value={mood}>
                    {mood}
                    </option>
                ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Skill Level</label>
                <select value={selectedSkill} onChange={(e) => setSkill(e.target.value)}
                className="border border-black-300 rounded px-3 py-3 text-sm cursor-pointer">
                    {skillLevels.map((skillLevel) => (
                        <option key={skillLevel} value={skillLevel}>
                        {skillLevel}
                        </option>))}
                </select>
            </div>

        </div>
    )
}