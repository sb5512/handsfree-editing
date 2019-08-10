import commandsENUM from "../components/tasks/freetextformation/commandENUM";
import TextToNumbers from "./textToNumbers";
import getSuggestionDictionary from "./suggestions";

class Utils {
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static getCurrentTime() {
    let today = new Date();
    let time =
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds() +
      ":" +
      today.getMilliseconds();
    return time;
  }

  static removeLastWordSeperateBylineIfpresent(sentence) {
    var lastIndex = sentence.lastIndexOf("\n");
    if (lastIndex > 0) {
      return sentence.substring(0, lastIndex);
    }
    return sentence;
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

  static insert(main_string, ins_string, pos) {
    if (typeof pos == "undefined") {
      pos = 0;
    }
    if (typeof ins_string == "undefined") {
      ins_string = "";
    }
    let main_string_arr = main_string.split(" ");
    main_string_arr.splice(pos - 1, 0, ins_string);
    return main_string_arr.join(" ");
  }

  // static saveAsCsv(data) {
  //   const ws = fs.createWriteStream("out.csv");
  //   fastcsv.write(data, { headers: true }).pipe(ws);
  // }

  static getSuggestionsDict() {
    return getSuggestionDictionary();
  }

  static obtainSuggestionForAllCharacters() {
    // call api and set the suggestion list using the word
    // TODO
    console.log("This function on getting all dictionary value is called");
    let characters = "abcdefghijklmnopqrstuvwxyz";
    let dictAllCharacters = {};
    characters.split("").map(character => {
      let result = [];
      let charactersLength = characters.length;
      for (var i = 0; i < 5; i++) {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength))
        );
      }
      dictAllCharacters[character] = result;
    });
    console.log(dictAllCharacters);
    return dictAllCharacters;
  }

  static checkStringIsNumberWordOrNumber(currentTranscription) {
    let suggestionListNumber;
    if (
      currentTranscription.endsWith("4") ||
      currentTranscription.endsWith("for")
    ) {
      console.log("It actually came here for the map numbers");
      suggestionListNumber = 4;
    } else {
      suggestionListNumber =
        currentTranscription.lastIndexOf(" ") > 0
          ? TextToNumbers.text2num(
              currentTranscription.substring(
                currentTranscription.lastIndexOf(" "),
                currentTranscription.length
              )
            )
          : parseInt(currentTranscription);
    }
    return {
      check: !isNaN(suggestionListNumber) && suggestionListNumber > 0,
      value: suggestionListNumber
    }; // currentTranscription.endsWith("1") || currentTranscription.endsWith("one")|| currentTranscription.endsWith("one");
  }
}

// module.exports = Utils;
export default Utils;
