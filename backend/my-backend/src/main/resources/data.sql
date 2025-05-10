INSERT INTO likes (user_id, video_id, mood, skill_level, liked) VALUES
-- Beginner users
(1, 'ppkv1bmGJUs', 'focused', 'beginner', true),
(1, 'dVTq72zRka4', 'focused', 'beginner', false),
(1, '4MPiZk5B0Rs', 'calm', 'beginner', true),

(2, 'ppkv1bmGJUs', 'focused', 'beginner', true),
(2, '7kznkkbGZC8', 'joyful', 'beginner', true),
(2, '-eDzk9zo2LA', 'joyful', 'beginner', false),

-- Intermediate users
(3, 'ppkv1bmGJUs', 'focused', 'intermediate', false),
(3, '4MPiZk5B0Rs', 'calm', 'intermediate', true),
(3, 'Y0qodvkA4RI', 'calm', 'intermediate', true),

(4, 'dVTq72zRka4', 'focused', 'intermediate', true),
(4, '-eDzk9zo2LA', 'joyful', 'intermediate', true),
(4, 'mSKQDvadrZA', 'sad', 'intermediate', false),

-- Advanced users
(5, 'qgTn51aRlIk', 'calm', 'advanced', true),
(5, 'DMRJwbeHL5s', 'focused', 'advanced', false),
(5, 'ppkv1bmGJUs', 'focused', 'advanced', true),

(6, '4MPiZk5B0Rs', 'calm', 'advanced', false),
(6, 'Y0qodvkA4RI', 'calm', 'advanced', true),
(6, 'qgTn51aRlIk', 'calm', 'advanced', true),

-- Mixed mood/skill
(7, '7kznkkbGZC8', 'joyful', 'beginner', true),
(7, 'mSKQDvadrZA', 'sad', 'beginner', false),
(7, 'DMRJwbeHL5s', 'focused', 'beginner', true),

(8, 'dVTq72zRka4', 'focused', 'intermediate', true),
(8, '-eDzk9zo2LA', 'joyful', 'intermediate', false),
(8, 'DMRJwbeHL5s', 'focused', 'intermediate', true),

(9, '4MPiZk5B0Rs', 'calm', 'advanced', true),
(9, 'Y0qodvkA4RI', 'calm', 'advanced', false),
(9, 'mSKQDvadrZA', 'sad', 'advanced', true);