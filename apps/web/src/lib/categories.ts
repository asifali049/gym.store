export interface CategoryItem {
  slug: string;
  name: string;
  description: string;
}

export interface CategoryGroup {
  slug: string;
  label: string;
  description: string;
  items: CategoryItem[];
}

// Static taxonomy — mirrors the category-bar nav. Swap for a live
// apiFetch('/categories') call once the API's categories endpoint is wired up.
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: 'brands',
    label: 'Brands',
    description: 'Shop by the brands trusted by athletes and lifters across India.',
    items: [
      { slug: 'peakfuel', name: 'PeakFuel', description: 'Our flagship line of lab-tested proteins and performance supplements.' },
      { slug: 'ignitelabs', name: 'IgniteLabs', description: 'High-stimulant pre-workouts and energy formulas.' },
      { slug: 'puregain', name: 'PureGain', description: 'Clean-label, minimal-ingredient nutrition.' },
      { slug: 'corestrong', name: 'CoreStrong', description: 'Strength and mass-building essentials.' },
      { slug: 'vitalform', name: 'VitalForm', description: 'Everyday wellness and multivitamin specialists.' },
    ],
  },
  {
    slug: 'benefits-concern',
    label: 'Benefits/Concern',
    description: 'Find products matched to your specific health and fitness goals.',
    items: [
      { slug: 'muscle-gain', name: 'Muscle Gain', description: 'Protein and mass-building support for lean gains.' },
      { slug: 'weight-loss', name: 'Weight Loss', description: 'Thermogenics and clean fuel for cutting phases.' },
      { slug: 'immunity', name: 'Immunity', description: 'Vitamins and minerals to support your immune system.' },
      { slug: 'joint-support', name: 'Joint Support', description: 'Glucosamine, collagen, and joint-care formulas.' },
      { slug: 'sleep-recovery', name: 'Sleep & Recovery', description: 'Magnesium, ZMA, and recovery-focused blends.' },
    ],
  },
  {
    slug: 'sports-nutrition',
    label: 'Sports Nutrition',
    description: 'Core performance supplements for training and competition.',
    items: [
      { slug: 'whey-protein', name: 'Whey Protein', description: 'Fast-absorbing protein for muscle repair and growth.' },
      { slug: 'mass-gainer', name: 'Mass Gainer', description: 'Calorie-dense formulas for bulking phases.' },
      { slug: 'creatine', name: 'Creatine', description: 'Proven strength and power output support.' },
      { slug: 'pre-workout', name: 'Pre-Workout', description: 'Energy, focus, and pump before training.' },
      { slug: 'bcaa', name: 'BCAA', description: 'Branched-chain amino acids for recovery.' },
    ],
  },
  {
    slug: 'vitamins-supplements',
    label: 'Vitamins & Supplements',
    description: 'Everyday nutrition to round out your diet.',
    items: [
      { slug: 'multivitamins', name: 'Multivitamins', description: 'Daily essential vitamins and minerals.' },
      { slug: 'omega-3', name: 'Omega 3', description: 'Fish oil for heart and brain health.' },
      { slug: 'vitamin-d', name: 'Vitamin D', description: 'Bone health and immune support.' },
      { slug: 'zinc', name: 'Zinc', description: 'Immune and recovery support mineral.' },
      { slug: 'probiotics', name: 'Probiotics', description: 'Gut health and digestion support.' },
    ],
  },
  {
    slug: 'healthy-snacking',
    label: 'Healthy Snacking',
    description: 'Protein-rich snacks that fit your macros.',
    items: [
      { slug: 'protein-bars', name: 'Protein Bars', description: 'On-the-go protein with clean ingredients.' },
      { slug: 'peanut-butter', name: 'Peanut Butter', description: 'High-protein, natural peanut butter.' },
      { slug: 'granola', name: 'Granola', description: 'Fiber-rich, protein-boosted granola.' },
      { slug: 'protein-chips', name: 'Protein Chips', description: 'Savory, high-protein snacking chips.' },
    ],
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    description: 'Gear to support your training.',
    items: [
      { slug: 'shakers', name: 'Shakers', description: 'Leak-proof bottles for your shakes.' },
      { slug: 'gym-bags', name: 'Gym Bags', description: 'Durable bags built for daily training.' },
      { slug: 'gloves', name: 'Gloves', description: 'Grip and hand protection for lifting.' },
      { slug: 'resistance-bands', name: 'Resistance Bands', description: 'Portable resistance training tools.' },
    ],
  },
];

export function getCategoryGroup(slug: string) {
  return CATEGORY_GROUPS.find((g) => g.slug === slug);
}

export function getCategoryItem(groupSlug: string, itemSlug: string) {
  const group = getCategoryGroup(groupSlug);
  return group?.items.find((i) => i.slug === itemSlug);
}
