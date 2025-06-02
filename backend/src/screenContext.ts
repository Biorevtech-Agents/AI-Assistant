let latestScreenText = '';

export function updateScreenText(text: string) {
  latestScreenText = text;
}

export function getScreenText() {
  return latestScreenText;
}
