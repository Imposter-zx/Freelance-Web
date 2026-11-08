export const EXPERIENCE_LEVELS = ['1-3 ans', '3-5 ans', '5-10 ans', '10+ ans'];

export const yearsOfExperience = (value) => {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const matchesExperience = (freelancer, level) => {
  if (!level) return true;

  const years = yearsOfExperience(freelancer.experience);

  if (level === '1-3 ans') return years >= 1 && years < 3;
  if (level === '3-5 ans') return years >= 3 && years <= 5;
  if (level === '5-10 ans') return years >= 5 && years <= 10;
  if (level === '10+ ans') return years > 10;

  return true;
};

export const filterFreelancers = ({ freelancers, searchTerm = '', filters = {}, sortBy = 'relevance' }) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filtered = freelancers.filter((freelancer) => {
    const matchesSearch =
      !normalizedSearch ||
      freelancer.name.toLowerCase().includes(normalizedSearch) ||
      freelancer.role.toLowerCase().includes(normalizedSearch) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(normalizedSearch));

    const matchesSkills =
      filters.skills?.length === 0 ||
      filters.skills.some((skill) => freelancer.skills.includes(skill));

    const matchesRating = freelancer.rating >= (filters.minRating || 0);
    const matchesLevel = matchesExperience(freelancer, filters.experience);

    return matchesSearch && matchesSkills && matchesRating && matchesLevel;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'experience') {
      return yearsOfExperience(b.experience) - yearsOfExperience(a.experience);
    }
    return 0;
  });
};
