import commandsENUM from "../components/tasks/freetextformation/commandENUM";
import TextToNumbers from "./textToNumbers";

class Utils {
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static containsCommand(transcriptArr) {
    const lastText = transcriptArr[transcriptArr.length - 1];

    switch (lastText) {
      case commandsENUM.MAP:
        transcriptArr.pop();
        return {
          command: "map",
          isCommand: true,
          updatedTranscript: transcriptArr
        };

      default:
        return { command: "null", isCommand: false };
    }
  }

  static checkStringIsNumberWordOrNumber(currentTranscription) {
    let suggestionListNumber =
      currentTranscription.lastIndexOf(" ") > 0
        ? TextToNumbers.text2num(
            currentTranscription.substring(
              currentTranscription.lastIndexOf(" "),
              currentTranscription.length
            )
          )
        : parseInt(currentTranscription);
    return { check: !isNaN(suggestionListNumber), value: suggestionListNumber }; // currentTranscription.endsWith("1") || currentTranscription.endsWith("one")|| currentTranscription.endsWith("one");
  }
}

// module.exports = Utils;
export default Utils;
