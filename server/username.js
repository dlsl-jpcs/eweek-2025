function sanitize(input) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/gi, '')
    .toLowerCase();
}

function deriveUsername(email, strategy = 'dot') {
  const [local] = email.split('@');
  const nameParts = local.split('_');
  const first = sanitize(nameParts[0] || '');
  const last = sanitize(nameParts[1] || '');

  switch (strategy) {
    case 'dot':
      return [first, last].filter(Boolean).join('.');
    case 'concat':
      return `${first}${last}`;
    case 'firstInitialLast':
      return `${first.charAt(0)}${last}`;
    case 'lastFirstInitial':
      return `${last}${first.charAt(0)}`;
    default:
      return [first, last].filter(Boolean).join('.');
  }
}

function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function prettifyNamePart(part) {
  return (part || '')
    .split('-')
    .map(capitalize)
    .join('-');
}

function deriveDisplayName(email) {
  const [local] = email.split('@');
  const nameParts = local.split('_');
  
  const firstName = prettifyNamePart(nameParts[0]);
  const secondName = prettifyNamePart(nameParts[1]);
  
  return [firstName, secondName].filter(Boolean).join(' ');
}

module.exports = { deriveUsername, deriveDisplayName };