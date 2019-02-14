/**
 * Formats seconds into HH:MM:SS, or MM:SS if under an hour.
 * @param {Number (in seconds) to format.} num
 */
export function formatTime(timeSeconds: number) {
  var converted = "" + timeSeconds;
  var sec_num = parseInt(converted, 10);
  var hours: number | string = Math.floor(sec_num / 3600);
  var minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
  var seconds: number | string = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (hours === "00") {
    return minutes + ":" + seconds;
  } else {
    return hours + ":" + minutes + ":" + seconds;
  }
}

export function removeTags(text: string) {
  if (text != null) {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
