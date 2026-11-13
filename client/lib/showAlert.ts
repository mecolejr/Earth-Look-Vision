import { Alert, AlertButton, Platform } from "react-native";

/**
 * Cross-platform alert. React Native's Alert.alert does nothing on web,
 * so on web this uses the browser's own dialogs. Use this instead of
 * Alert.alert everywhere (see ISSUES.md #28).
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }
  const text = message ? `${title}\n\n${message}` : title;
  const actions = (buttons || []).filter((b) => b.style !== "cancel");
  const cancel = (buttons || []).find((b) => b.style === "cancel");
  const hasChoice = (buttons || []).length > 1;

  if (!hasChoice) {
    window.alert(text);
    actions[0]?.onPress?.();
    return;
  }
  if (actions.length === 1) {
    if (window.confirm(text)) actions[0].onPress?.();
    else cancel?.onPress?.();
    return;
  }
  for (const action of actions) {
    if (window.confirm(`${text}\n\nChoose "${action.text}"?`)) {
      action.onPress?.();
      return;
    }
  }
  cancel?.onPress?.();
}
