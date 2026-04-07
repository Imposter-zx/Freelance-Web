# Changelog

## [Unreleased]
### Added
- Integrate @chenglou/pretext for text measurement and layout to dramatically improve chat previews, descriptions and search result rendering
- Add new pretext components:
  - MessageBubble.jsx (optimized message rendering with pretext)
  - MessagePreview.jsx (smart text truncation without DOM reflow)
  - ProjectDescription.jsx (expandable text with optimal line handling)
  - TextMeasure.jsx (React hook for text measurement)
- Update Messages and SearchFreelance to leverage pretext-based rendering for text blocks
- Add avatar/photo handling with fallbacks to initials in Profile, SearchFreelance, and Messages components
- Add global design refresh via designs_refresh.css with card utilities and design polish
- Add GitHub Actions CI workflow for build, lint, and test automation
- Add automatic PR creation workflow (commented out for security)
- Enhanced Header design with translucent background when not scrolled
- Add gradient hero background to Home section
- Apply card styling to freelancer cards in SearchFreelance
- Update Profile page to use ProjectDescription for about section
- Add photo field to freelancer mock data (ready for actual image URLs)

### Changed
- Refactor avatar rendering to conditionally show photos or initials
- Update Header background from transparent to subtle translucent when not scrolled
- Change Home hero background from solid to soft gradient
- Apply .card class to freelancer cards for consistent styling
- Use pretext-based text measurement in MessageBubble, MessagePreview, and ProjectDescription components
- Improve render performance and reduce DOM reflows through pretext integration

## [0.2.0] - 2026-04-07
### Added
- Initial Pretext integration for text layout
- Basic avatar/photo handling
- CI workflow setup
- Design refresh foundations
- Core messaging, project posting, profile, and settings features