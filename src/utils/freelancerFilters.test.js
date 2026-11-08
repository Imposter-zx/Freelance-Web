import { describe, expect, it } from 'vitest';
import { filterFreelancers, matchesExperience } from './freelancerFilters';

const freelancers = [
  {
    id: 1,
    name: 'Ava Carter',
    role: 'Senior React Developer',
    experience: '6 ans',
    skills: ['React', 'Node.js', 'AWS'],
    rating: 4.9,
    hourlyRate: 90,
  },
  {
    id: 2,
    name: 'Marco Silva',
    role: 'Brand Designer',
    experience: '2 ans',
    skills: ['Figma', 'Webflow', 'Branding'],
    rating: 4.5,
    hourlyRate: 60,
  },
  {
    id: 3,
    name: 'Nora Khan',
    role: 'SEO Strategist',
    experience: '10 ans',
    skills: ['SEO', 'Analytics', 'Copywriting'],
    rating: 5.0,
    hourlyRate: 75,
  },
];

describe('filterFreelancers', () => {
  it('matches a skill and text search together', () => {
    const results = filterFreelancers({
      freelancers,
      searchTerm: 'ava',
      filters: { skills: ['AWS'], minRating: 0, experience: '' },
      sortBy: 'relevance',
    });

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Ava Carter');
  });

  it('filters by rating and experience level', () => {
    const results = filterFreelancers({
      freelancers,
      searchTerm: '',
      filters: { skills: [], minRating: 4.8, experience: '5-10 ans' },
      sortBy: 'rating',
    });

    expect(results.map((person) => person.name)).toEqual(['Nora Khan', 'Ava Carter']);
  });

  it('sorts by lowest price when selected', () => {
    const results = filterFreelancers({
      freelancers,
      searchTerm: '',
      filters: { skills: [], minRating: 0, experience: '' },
      sortBy: 'price',
    });

    expect(results.map((person) => person.hourlyRate)).toEqual([60, 75, 90]);
  });
});

describe('matchesExperience', () => {
  it('classifies experience ranges correctly', () => {
    expect(matchesExperience({ experience: '2 ans' }, '1-3 ans')).toBe(true);
    expect(matchesExperience({ experience: '6 ans' }, '5-10 ans')).toBe(true);
    expect(matchesExperience({ experience: '10 ans' }, '5-10 ans')).toBe(true);
    expect(matchesExperience({ experience: '11 ans' }, '10+ ans')).toBe(true);
    expect(matchesExperience({ experience: '2 ans' }, '3-5 ans')).toBe(false);
  });
});
