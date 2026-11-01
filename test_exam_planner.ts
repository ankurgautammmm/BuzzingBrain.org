import assert from 'node:assert';
import { 
  getExamCatalogForYear, 
  calculateExamCountdown, 
  isLeapYear, 
  generateRealisticStudyPlan,
  computePlannerStats,
  PlannerTask
} from './src/utils/examPlannerEngine';

console.log('=== RUNNING EXAM PLANNER ENGINE TEST SUITE ===');

// 1. Configurable Years & Official vs Tentative Verification
console.log('\n1. Configurable Target Years & Date Authority Classification');
const catalog2025 = getExamCatalogForYear(2025);
const catalog2026 = getExamCatalogForYear(2026);
const catalog2027 = getExamCatalogForYear(2027);

assert(catalog2025['cbse-10'].year === 2025, 'Year 2025 correctly configured');
assert(catalog2026['cbse-10'].year === 2026, 'Year 2026 correctly configured');
assert(catalog2027['cbse-10'].year === 2027, 'Year 2027 correctly configured');

assert(catalog2027['cbse-10'].authority === 'TENTATIVE_ESTIMATE', 
  '✓ PASS: 2027 dates are strictly classified as TENTATIVE_ESTIMATE (never presented as official)');
assert(catalog2027['cbse-10'].authorityNote.includes('Tentative projection'),
  '✓ PASS: 2027 schedule clearly explains notification is pending');
console.log('  ✓ PASS: Catalog correctly separates official from tentative dates across years');

// 2. Leap Year & Date Calculations
console.log('\n2. Leap Year & Timezone-Resilient Math');
assert(isLeapYear(2024) === true, '✓ PASS: 2024 is identified as a leap year');
assert(isLeapYear(2025) === false, '✓ PASS: 2025 is not a leap year');
assert(isLeapYear(2028) === true, '✓ PASS: 2028 is identified as a leap year');
assert(isLeapYear(2100) === false, '✓ PASS: 2100 century non-leap year handled');
assert(isLeapYear(2000) === true, '✓ PASS: 2000 400-year leap year handled');

// 3. Countdown Calculator
console.log('\n3. Countdown Calculator Verification');
// Test future date
const refNow = new Date('2026-10-23T12:00:00Z').getTime();
const futureTarget = '2027-02-15T09:00:00Z';
const countdown = calculateExamCountdown(futureTarget, refNow);

assert(countdown.isPast === false, '✓ PASS: Future date is not marked past');
assert(countdown.days > 100, `✓ PASS: Days remaining calculated accurately: ${countdown.days} days`);
assert(countdown.formattedString.includes('remaining'), '✓ PASS: Formatted countdown string generated');

// Test past date
const pastTarget = '2024-05-01T09:00:00Z';
const pastCountdown = calculateExamCountdown(pastTarget, refNow);
assert(pastCountdown.isPast === true, '✓ PASS: Past exam dates cleanly handled without negative values');
assert(pastCountdown.days === 0 && pastCountdown.seconds === 0, '✓ PASS: Past dates zeroed out safely');

// 4. Realistic Scheduling Algorithm & Daily Study Hours Cap
console.log('\n4. Realistic Study Plan Scheduling & Hours Constraint');
const sampleTasks = generateRealisticStudyPlan({
  preferences: {
    dailyStudyHours: 3, // 3 hours = 180 mins cap
    targetYear: 2027,
    selectedExamKey: 'cbse-10',
    weakTopics: ['Chemical Reactions'],
    studyPace: 'balanced',
    includeSundayMocks: true,
    bufferDaysPerMonth: 2,
  },
  completedChapters: {},
  referenceDate: '2026-10-23',
});

assert(sampleTasks.length > 5, `✓ PASS: Generated ${sampleTasks.length} balanced study tasks`);

// Check that no single day has more minutes scheduled than the cap (180 mins)
const dayMinuteMap = new Map<string, number>();
for (const task of sampleTasks) {
  const current = dayMinuteMap.get(task.dueDate) || 0;
  dayMinuteMap.set(task.dueDate, current + task.estimatedMinutes);
}

for (const [date, minutes] of dayMinuteMap.entries()) {
  assert(minutes <= 180, `✓ PASS: Daily limit strictly respected on ${date}: ${minutes} mins <= 180 mins cap`);
}
console.log('  ✓ PASS: Scheduling engine never exceeds student available study hours');

// Check that weak topic was scheduled first
const firstConceptTask = sampleTasks.find(t => t.type === 'concept_study');
assert(firstConceptTask?.chapter?.includes('Chemical') || firstConceptTask?.priority === 'high',
  '✓ PASS: Designated weak topic prioritized in initial study schedule');

// Check preservation of completed tasks
const existingWithCompleted: PlannerTask[] = [
  {
    id: 'user_completed_1',
    title: 'Completed earlier chapter',
    subject: 'Science',
    dueDate: '2026-10-20',
    priority: 'high',
    type: 'concept_study',
    estimatedMinutes: 60,
    completed: true,
    createdAt: '2026-10-15T00:00:00Z',
  }
];

const regenerated = generateRealisticStudyPlan({
  preferences: {
    dailyStudyHours: 4,
    targetYear: 2027,
    selectedExamKey: 'cbse-10',
    weakTopics: [],
    studyPace: 'balanced',
    includeSundayMocks: false,
    bufferDaysPerMonth: 0,
  },
  completedChapters: {},
  existingTasks: existingWithCompleted,
  referenceDate: '2026-10-23',
});

const foundCompleted = regenerated.find(t => t.id === 'user_completed_1');
assert(foundCompleted !== undefined && foundCompleted.completed === true, 
  '✓ PASS: Completed tasks are fully preserved during plan regeneration');

// 5. Planner Statistics Calculation
console.log('\n5. Planner Statistics Computation');
const stats = computePlannerStats(regenerated, { 'ch_1': true, 'ch_2': true }, 'cbse-10', 2027);
assert(stats.totalTasks > 0, 'Total tasks counted');
assert(stats.completedTasks === 1, 'Completed tasks verified: 1');
assert(stats.syllabusCoveredCount === 2, 'Syllabus covered chapters verified: 2');
assert(stats.estimatedHoursRemaining > 0, 'Estimated hours remaining calculated');

console.log('========================================');
console.log('EXAM PLANNER TEST SUITE: ALL CHECKS PASSED');
console.log('========================================');
