import { PracticalExperiment, ExamTarget, PracticalSubject, PracticalClassGrade } from '../types/laboratory';
import { CHEMISTRY_ACID_BASE_EXPERIMENT } from './chemistryAcidBaseExperiment';
import { BIOLOGY_MICROSCOPE_EXPERIMENT } from './biologyMicroscopeExperiment';
import { PHYSICS_OHMS_LAW_EXPERIMENT } from './physicsOhmsLawExperiment';

export const PRACTICAL_EXPERIMENTS_REGISTRY: PracticalExperiment[] = [
  CHEMISTRY_ACID_BASE_EXPERIMENT,
  BIOLOGY_MICROSCOPE_EXPERIMENT,
  PHYSICS_OHMS_LAW_EXPERIMENT
];

export function getExperimentById(id: string): PracticalExperiment | undefined {
  return PRACTICAL_EXPERIMENTS_REGISTRY.find(e => e.id === id);
}

export function filterExperiments(options: {
  classGrade?: string;
  subject?: string;
  examTarget?: string;
  searchQuery?: string;
}): PracticalExperiment[] {
  const { classGrade, subject, examTarget, searchQuery } = options;

  return PRACTICAL_EXPERIMENTS_REGISTRY.filter(exp => {
    // Class grade filter
    if (classGrade && classGrade !== 'All' && exp.classGrade !== classGrade) {
      return false;
    }

    // Subject filter
    if (subject && subject !== 'All' && exp.subject !== subject) {
      return false;
    }

    // Exam target filter
    if (examTarget && examTarget !== 'all' && !exp.examTags.includes(examTarget as ExamTarget)) {
      return false;
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exp.title.toLowerCase().includes(q);
      const matchChapter = exp.chapter.toLowerCase().includes(q);
      const matchSubject = exp.subject.toLowerCase().includes(q);
      const matchObjectives = exp.learningObjectives.some(o => o.toLowerCase().includes(q));
      if (!matchTitle && !matchChapter && !matchSubject && !matchObjectives) {
        return false;
      }
    }

    return true;
  });
}
