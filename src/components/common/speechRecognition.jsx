import React, { Component } from "react";
import Utils from "../../utils/Utils";
import getReplyQuestions from "../../utils/replyQuestions";
import getPhrases from "../../utils/phrases";

export default function SpeechRecognition(options) {
  const SpeechRecognitionInner = function(WrappedComponent) {
    const BrowserSpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition);
    const recognition = BrowserSpeechRecognition
      ? new BrowserSpeechRecognition()
      : null;
    const browserSupportsSpeechRecognition = recognition !== null;
    let listening;
    if (
      !browserSupportsSpeechRecognition ||
      (options && options.autoStart === false)
    ) {
      listening = false;
    } else {
      recognition.start();
      listening = true;
    }
    let pauseAfterDisconnect = false;
    let interimTranscript = "";
    let finalTranscript = "";
    let holdingFinalTranscript = "";
    let commands = [];

    return class SpeechRecognitionContainer extends Component {
      constructor(props) {
        super(props);

        if (browserSupportsSpeechRecognition) {
          recognition.continuous = options.continuous !== false;
          recognition.interimResults = true;
          recognition.onresult = this.updateTranscript.bind(this);
          recognition.onend = this.onRecognitionDisconnect.bind(this);
        }

        this.state = {
          interimTranscript,
          finalTranscript,
          listening,
          commands: [],
          hasCommand: false,
          hasSelectCommand: false,
          hasNextCommand: false,
          phraseQuestionImageCount: 0,
          imageNumber: 0, //Utils.getRandomInt(4),
          spellMode: false,
          oldTranscript: "",
          mappingNumber: null,
          // Part of suggestion - Begins
          suggestionMode: false,
          suggestionListNumber: null,
          suggestionList: {},
          // Part of suggestion - Ends

          // Logging information Begins
          logData: [],
          logDataPersist: [],
          // Logging information Ends

          toCorrectInSpellModeWord: ""
        };
      }

      disconnect = disconnectType => {
        if (recognition) {
          switch (disconnectType) {
            case "ABORT":
              pauseAfterDisconnect = true;
              recognition.abort();
              break;
            case "RESET":
              pauseAfterDisconnect = false;
              recognition.abort();
              break;
            case "STOP":
            default:
              pauseAfterDisconnect = true;
              recognition.stop();
          }
        }
      };

      onRecognitionDisconnect() {
        listening = false;
        if (pauseAfterDisconnect) {
          this.setState({ listening });
        } else if (recognition) {
          if (recognition.continuous) {
            this.startListening();
          } else {
            this.setState({ listening });
          }
        }
        pauseAfterDisconnect = false;
      }

      updateSplitFinalTranscriptCommands(toChangeScript) {
        toChangeScript = toChangeScript.substring(0, toChangeScript.length - 1);
        return toChangeScript;
      }

      containsMapCommands(interimWord) {
        return interimWord.endsWith("map") || interimWord.endsWith("Map");
      }

      containsNextMapSelectCommands(interimWord) {
        return (
          interimWord.endsWith("map") ||
          interimWord.endsWith("Map") ||
          interimWord.endsWith("Next") ||
          interimWord.endsWith("next") ||
          interimWord.endsWith("select") ||
          interimWord.endsWith("Select")
        );
      }

      containsCommands(interimWord) {
        return (
          interimWord.endsWith("map") ||
          interimWord.endsWith("finish") ||
          interimWord.endsWith("Map") ||
          interimWord.endsWith("Finish") ||
          interimWord.endsWith("clear") ||
          interimWord.endsWith("Clear") ||
          interimWord.endsWith("Next") ||
          interimWord.endsWith("next") ||
          interimWord.endsWith("select") ||
          interimWord.endsWith("Select")
        );
      }

      checkSecondLastWord(toCheckWord, sentence) {
        let removedLastWordSentence = this.removeLastWord(sentence);
        return removedLastWordSentence.endsWith(toCheckWord);
      }

      lowercaseWordByIndex(sentence, index) {
        let newSentenceArr = sentence.split(" ");
        newSentenceArr[index - 1] = newSentenceArr[
          index - 1
        ].toLocaleLowerCase();
        return newSentenceArr.join(" ");
      }

      insertWordInFrontByIndex(sentence, toInsertWord, index) {
        return Utils.insert(sentence, toInsertWord, index);
      }

      removeLastWord(sentence) {
        var lastIndex = sentence.lastIndexOf(" ");
        if (lastIndex > 0) {
          return sentence.substring(0, lastIndex);
        }
        return "";
      }

      removeWordByIndex(sentence, index) {
        let newSentenceArr = sentence.split(" ");
        newSentenceArr.splice(index - 1, 1);
        return newSentenceArr.join(" ");
      }

      replaceSpaceWithActualSpace(sentence, logData) {
        if (sentence.includes("space")) {
          logData.push({
            command: "S_SpaceReplace",
            time: Utils.getCurrentTime(),
            text:
              '"Finish" command within spell mode removed space with actual space at  : ' +
              Utils.getCurrentTime(),
            textForLog: ""
          });
        }
        return sentence.split("space").join(" ");
      }

      replaceWordWithSpellWord(oldTranscript, toReplaceWord, allTranscript) {
        //first remove allTranscript of oldTranscript
        const oldTranscriptLength = oldTranscript.length;
        let replacingWord = allTranscript
          .substring(oldTranscriptLength)
          .replace(/ /g, "");
        return oldTranscript.replace(toReplaceWord, replacingWord);
      }

      replaceWordWithSuggestionWord(
        toReplaceWord,
        replacingWord,
        allTranscript
      ) {
        return allTranscript.replace(toReplaceWord, replacingWord);
      }

      obtainSuggestionForLetter(word) {
        // call api and set the suggestion list using the word
        // TODO
        return ["m", "a", "n"];
      }

      // THIS IS WHERE WE INDUCE ERRORS
      setSuggestionList = (word, suggestions, shouldReplace) => {
        console.log("THIS WORD SHOULD BE REPLACED", word, shouldReplace);
        let newDict = this.state.suggestionList;

        let randomNumber = Math.floor(Math.random() * 6); // use this to replace a suggestion word in list
        if (shouldReplace) {
          if (!newDict[word + "***"]) {
            finalTranscript = finalTranscript.replace(
              word,
              suggestions[randomNumber]
            );
          }
          let replacedWord = suggestions[randomNumber] + "***";
          newDict[replacedWord] = [word];
        }
        if (newDict[word + "***"]) {
          // if suggestion doesnot have the newDict[word + "***"]
          if (suggestions.indexOf(newDict[word + "***"]) > -1) {
            suggestions[randomNumber] = newDict[word + "***"];
          }
          newDict[word] = suggestions;
        } else {
          newDict[word] = suggestions;
        }

        this.setState({
          suggestionList: newDict
        });
      };

      clickMouse = () => {
        fetch(
          "https://hooks.slack.com/services/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",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
              channel: "test_ob_tooling",
              text: "#clickmouse"
            })
          }
        );
      };

      logTimeDataWhenHoveredAtWord = word => {
        let logData = [...this.state.logData];
        logData.push({
          command: "Look",
          time: Utils.getCurrentTime(),
          text: 'Looked at "' + word + '" at : ' + Utils.getCurrentTime(),
          textForLog: word
        });
        this.setState({ logData: logData });
      };

      handleWordClickToGetToMappingWithNumberState = (index, word) => {
        let logData = [...this.state.logData];
        logData.push({
          command: "Gaze Click",
          time: Utils.getCurrentTime(),
          text:
            'Clicked at "' +
            word +
            '" positioned index ' +
            index +
            " at : " +
            Utils.getCurrentTime(),
          textForLog: word
        });
        this.setState({
          hasCommand: true,
          mappingNumber: index,
          suggestionMode: false,
          logData: logData
        });
      };

      updateTranscript(event) {
        interimTranscript = "";
        let mappingNumber = null;
        let suggestionListNumber = null;
        let hasCommand = false;
        let hasSelectCommand = false;
        let hasNextCommand = false;
        let phraseQuestionImageCount = this.state.phraseQuestionImageCount;
        let imageNumber = this.state.imageNumber;
        let spellMode = this.state.spellMode;
        let suggestionMode = false;
        let oldTranscript = this.state.oldTranscript;
        let toCorrectInSpellModeWord = this.state.toCorrectInSpellModeWord;
        let suggestionList = this.state.suggestionList;
        let logData = this.state.logData;
        let logDataPersist = this.state.logDataPersist;

        /**
         * state hascommand true bhayo bhane hami command mode ma cham
         * Command is already set to "map". Now we here see what after we say "map" command
         */
        if (this.state.hasCommand) {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            let currentTranscription = event.results[i][0].transcript.trim();
            let objIsNumberAndVal = Utils.checkStringIsNumberWordOrNumber(
              currentTranscription
            );

            // get final transcript here
            if (event.results[i].isFinal) {
              if (
                currentTranscription.endsWith("finish") ||
                currentTranscription.endsWith("Finish")
              ) {
                hasCommand = false;
                spellMode = false;
                mappingNumber = null;
                suggestionMode = false;
                oldTranscript = "";
                if (this.state.spellMode) {
                  // only if spell mode on we revert transcript back to old transcript
                  // TODO replace the transcript
                  finalTranscript = this.replaceWordWithSpellWord(
                    this.state.oldTranscript,
                    this.state.toCorrectInSpellModeWord,
                    finalTranscript
                  );
                  logData.push({
                    command: "S_Finish",
                    time: Utils.getCurrentTime(),
                    text:
                      '"Finish" command within spell mode given at : ' +
                      Utils.getCurrentTime(),
                    textForLog: ""
                  });
                } else {
                  logData.push({
                    command: "Finish",
                    time: Utils.getCurrentTime(),
                    text:
                      '"Finish" command given at : ' + Utils.getCurrentTime(),
                    textForLog: ""
                  });
                }
              } else if (
                currentTranscription.endsWith("cancel") ||
                currentTranscription.endsWith("Cancel")
              ) {
                if (this.state.spellMode) {
                  console.log("Cancel command when inside spell mode");
                  suggestionMode = false;
                  hasCommand = false;
                  // finalTranscript = this.removeLastWord(finalTranscript);
                  logData.push({
                    command: "S_Cancel",
                    time: Utils.getCurrentTime(),
                    text:
                      '"Cancel" command given within spell mode at : ' +
                      Utils.getCurrentTime(),
                    textForLog: ""
                  });
                }
              } else if (
                (currentTranscription.endsWith("spell") ||
                  currentTranscription.endsWith("Spell")) &&
                this.state.mappingNumber &&
                !this.state.spellMode
              ) {
                // This is where we will check if selection mode is on and "spell word is in the transcript"
                console.log("I AM IN SPELL MODE");
                hasCommand = false; // Still command mode
                spellMode = true;
                suggestionMode = false;
                oldTranscript = this.state.finalTranscript; // we set oldtranscript for future use
                toCorrectInSpellModeWord = this.state.finalTranscript.split(
                  " "
                )[this.state.mappingNumber - 1];
                mappingNumber = null;
                logData.push({
                  command: "Spell",
                  time: Utils.getCurrentTime(),
                  text:
                    '"spell" command activated spell mode at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                currentTranscription.endsWith("delete") &&
                this.state.mappingNumber
              ) {
                console.log("DELETE WORD AFTER SAYING MAP AND NUMBER");
                suggestionMode = false;
                finalTranscript = this.removeWordByIndex(
                  finalTranscript,
                  this.state.spellMode
                    ? this.state.mappingNumber +
                        this.state.oldTranscript.split(" ").length
                    : this.state.mappingNumber
                );
                logData.push({
                  command: "Delete No." + this.state.mappingNumber,
                  time: Utils.getCurrentTime(),
                  text:
                    '"delete" command for mapped number' +
                    this.state.mappingNumber +
                    "given at : " +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (currentTranscription.endsWith("delete")) {
                console.log("DELETE LAST WORD OF SENTENCE");
                suggestionMode = false;
                finalTranscript = this.removeLastWord(finalTranscript);
                logData.push({
                  command: "Delete Last",
                  time: Utils.getCurrentTime(),
                  text: '"delete" command given at : ' + Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                // Here we check if the transcript is a number
                //&&
                !this.state.mappingNumber &&
                objIsNumberAndVal.check
              ) {
                hasCommand = true;
                spellMode = this.state.spellMode;
                suggestionMode = false;
                mappingNumber = objIsNumberAndVal.value;
                logData.push({
                  command: "Map No. " + mappingNumber,
                  time: Utils.getCurrentTime(),
                  text:
                    "Mapped Number " +
                    mappingNumber +
                    " given at : " +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                currentTranscription.endsWith("lowercase") &&
                this.state.mappingNumber //
              ) {
                console.log("GOING TO MAKE THE SELECTED WORD TO LOWERCASE");
                suggestionMode = false;
                finalTranscript = this.lowercaseWordByIndex(
                  finalTranscript,
                  this.state.mappingNumber
                );
                logData.push({
                  command: "Lowercase",
                  time: Utils.getCurrentTime(),
                  text:
                    '"lowercase" command given at : ' + Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                // secondlast word is an insert
                this.checkSecondLastWord("insert", currentTranscription) &&
                this.state.mappingNumber //
              ) {
                console.log("TO INSERT TEXT INFRONT OF A SENTENCE");
                suggestionMode = false;
                finalTranscript = this.insertWordInFrontByIndex(
                  finalTranscript,
                  currentTranscription
                    .trim()
                    .split(" ")
                    .pop(),
                  this.state.mappingNumber
                );
                logData.push({
                  command: "Insert",
                  time: Utils.getCurrentTime(),
                  text: '"Insert" command given at : ' + Utils.getCurrentTime(),
                  textForLog: ""
                });
              } // Let us check if we can check for numbers if they exist
              else if (
                objIsNumberAndVal.check &&
                this.state.mappingNumber &&
                objIsNumberAndVal.value === 1 //
              ) {
                console.log("SUGGESTION LIST FOR FIRST ELEMENT");
                suggestionMode = true;
                suggestionListNumber = 0;
                mappingNumber = this.state.mappingNumber;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber

                logData.push({
                  command: "Option '1'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "1" i.e. first element from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                (currentTranscription.endsWith("a") ||
                  currentTranscription.endsWith("hey") ||
                  currentTranscription.endsWith("Hey") ||
                  currentTranscription.endsWith("A") ||
                  currentTranscription.endsWith("First") ||
                  currentTranscription.endsWith("first")) &&
                this.state.mappingNumber
              ) {
                console.log("SUGGESTION LIST FOR A");
                suggestionMode = true;
                suggestionListNumber = 0;
                mappingNumber = this.state.mappingNumber;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber

                logData.push({
                  command: "Option 'a'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "a" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                objIsNumberAndVal.check &&
                this.state.mappingNumber &&
                objIsNumberAndVal.value === 2 //
              ) {
                console.log("SUGGESTION LIST FOR SECOND ELEMENT");
                suggestionMode = true;
                suggestionListNumber = 1;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option '2'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "2" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                (currentTranscription.endsWith("B") ||
                  currentTranscription.endsWith("b") ||
                  currentTranscription.endsWith("be") ||
                  currentTranscription.endsWith("Be") ||
                  currentTranscription.endsWith("Second") ||
                  currentTranscription.endsWith("second")) &&
                this.state.mappingNumber
              ) {
                console.log("SUGGESTION LIST FOR B");
                suggestionMode = true;
                suggestionListNumber = 1;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option 'b'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "b" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                objIsNumberAndVal.check &&
                this.state.mappingNumber &&
                objIsNumberAndVal.value === 3 //
              ) {
                console.log("SUGGESTION LIST FOR THIRD ELEMENT");
                suggestionMode = true;
                suggestionListNumber = 2;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option '3'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "3" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                (currentTranscription.endsWith("c") ||
                  currentTranscription.endsWith("C") ||
                  currentTranscription.endsWith("see") ||
                  currentTranscription.endsWith("scene") ||
                  currentTranscription.endsWith("Scene") ||
                  currentTranscription.endsWith("Sing") ||
                  currentTranscription.endsWith("sing") ||
                  currentTranscription.endsWith("Third") ||
                  currentTranscription.endsWith("third")) &&
                this.state.mappingNumber
              ) {
                console.log("SUGGESTION LIST FOR C");
                suggestionMode = true;
                suggestionListNumber = 2;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option 'c'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "c" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                objIsNumberAndVal.check &&
                this.state.mappingNumber &&
                objIsNumberAndVal.value === 4 //
              ) {
                console.log("SUGGESTION LIST FOR FOURTH ELEMENT");
                suggestionMode = true;
                suggestionListNumber = 3;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option '4'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "4" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                (currentTranscription.endsWith("d") ||
                  currentTranscription.endsWith("D") ||
                  currentTranscription.endsWith("D&D") ||
                  currentTranscription.endsWith("Fourth") ||
                  currentTranscription.endsWith("fourth")) &&
                this.state.mappingNumber
              ) {
                console.log("SUGGESTION LIST FOR D");
                suggestionMode = true;
                suggestionListNumber = 3;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option 'd'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "d" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                objIsNumberAndVal.check &&
                this.state.mappingNumber &&
                objIsNumberAndVal.value === 5 //
              ) {
                console.log("SUGGESTION LIST FOR FIFTH ELEMENT");
                suggestionMode = true;
                suggestionListNumber = 4;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option 'e'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "5" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (
                (currentTranscription.endsWith("e") ||
                  currentTranscription.endsWith("E") ||
                  currentTranscription.endsWith("Fifth") ||
                  currentTranscription.endsWith("fifth")) &&
                this.state.mappingNumber
              ) {
                console.log("SUGGESTION LIST FOR E");
                suggestionMode = true;
                suggestionListNumber = 4;
                mappingNumber = this.state.mappingNumber;
                logData.push({
                  command: "Option 'e'",
                  time: Utils.getCurrentTime(),
                  text:
                    'Chosen "e" command from suggestion list at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else {
                // Firstly we come here when we say "map " and after that If no "Done" , If no "spell" , if no "number"
                // We do nothing
                mappingNumber = this.state.mappingNumber;
                hasCommand = true;
                spellMode = this.state.spellMode;
                suggestionMode = false;
              }
            } else {
              // Even interim results has some command then execute it.
              mappingNumber = this.state.mappingNumber;
              hasCommand = true;
              spellMode = this.state.spellMode;
              suggestionMode = false;
            }
          }
        } else {
          /**
           * when the real transcription happens. It will not come here when we say "map" because command mode is in place.
           */
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              let trimmedTranscript = event.results[i][0].transcript.trim();
              let ifContainsMap = this.containsMapCommands(trimmedTranscript);
              let ifContainsFinish =
                trimmedTranscript.endsWith("finish") ||
                trimmedTranscript.endsWith("Finish");
              let ifContainsClear =
                trimmedTranscript.endsWith("Clear") ||
                trimmedTranscript.endsWith("clear");
              let ifContainsSelect =
                trimmedTranscript.endsWith("Select") ||
                trimmedTranscript.endsWith("select");
              let ifContainsNext =
                trimmedTranscript.endsWith("Next") ||
                trimmedTranscript.endsWith("next");
              let ifContainsNextMapSelect = this.containsNextMapSelectCommands(
                trimmedTranscript
              );

              // HERE WE RESET OUR SUGGESTIONS
              // suggestionList = [];
              suggestionMode = false;
              suggestionListNumber = null;
              if (ifContainsMap) {
                // commands.push("map");
                hasCommand = true;

                // TIMERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR STARTSSSS
                ///////////////////////////////////////////////////////
                logData.push({
                  command: "Map",
                  time: Utils.getCurrentTime(),
                  text: '"Map" command given at : ' + Utils.getCurrentTime(),
                  textForLog: ""
                });
              }
              if (ifContainsSelect) {
                // hasSelectCommand = true;
                // mappingNumber = 2;
                logData.push({
                  command: "Click",
                  time: Utils.getCurrentTime(),
                  text: '"Click" command given at : ' + Utils.getCurrentTime(),
                  textForLog: ""
                });
                this.clickMouse();
              }
              if (ifContainsNext) {
                logData.push({
                  command: "EndTask",
                  time: Utils.getCurrentTime(),
                  text: '"Next" command given at : ' + Utils.getCurrentTime(),
                  textForLog: finalTranscript
                });
                hasNextCommand = true; // Used when we think some finalscript comes late .i.e race condition

                let whichTask = window.location.pathname.split("/").pop();
                whichTask === "freetextformationtask"
                  ? (imageNumber = this.state.imageNumber + 1) // change number 4 using total lengths of images available
                  : (phraseQuestionImageCount =
                      this.state.phraseQuestionImageCount + 1);

                interimTranscript = "";
                logDataPersist = [...logDataPersist, ...logData];
                logData = []; //make log data empty

                finalTranscript = "";
              }
              // If we say map and go to spell mode and now in that state we say "a" "b" "c" and say done then we come here
              if (this.state.spellMode && ifContainsFinish) {
                spellMode = false;
                // This is where we will have to replace the spell mode text

                finalTranscript = this.replaceWordWithSpellWord(
                  this.state.oldTranscript,
                  this.state.toCorrectInSpellModeWord,
                  finalTranscript
                );
                // now replace "space" with actual space
                finalTranscript = this.replaceSpaceWithActualSpace(
                  finalTranscript,
                  logData
                );
                logData.push({
                  command: "S_Finish",
                  time: Utils.getCurrentTime(),
                  text:
                    '"Finish" command within spell mode given at : ' +
                    Utils.getCurrentTime(),
                  textForLog: ""
                });
              } else if (ifContainsClear) {
                if (this.state.spellMode) {
                  finalTranscript = oldTranscript;
                  logData.push({
                    command: "S_Clear",
                    time: Utils.getCurrentTime(),
                    text:
                      '"Clear" command within spell mode given at : ' +
                      Utils.getCurrentTime(),
                    textForLog: ""
                  });
                } else {
                  finalTranscript = "";
                  logData.push({
                    command: "Clear",
                    time: Utils.getCurrentTime(),
                    text:
                      '"Clear" command given at : ' + Utils.getCurrentTime(),
                    textForLog: ""
                  });
                }
              }
              // finalscript k bhayo ta
              else {
                // Let us check if in spell mode we only accept letters
                // if (this.state.spellMode){
                //   event.results[i][0].transcript
                // }
                finalTranscript = this.concatTranscripts(
                  finalTranscript,
                  ifContainsNextMapSelect
                    ? this.removeLastWord(event.results[i][0].transcript)
                    : event.results[i][0].transcript
                );
              }
            } else {
              // INTERIM TRANSCRIPT HORA YO??
              // log data at beginning of transcription
              if (finalTranscript === "" && logData.length === 0) {
                let whichTask = window.location.pathname.split("/").pop();
                let startingSentence = "";
                switch (whichTask) {
                  case "freetextformationtask":
                    startingSentence =
                      "Image " + this.state.imageNumber + " is used";
                    break;
                  case "replytask":
                    startingSentence = getReplyQuestions(
                      this.state.phraseQuestionImageCount
                    );
                    break;
                  case "copytask":
                    startingSentence = getPhrases(
                      this.state.phraseQuestionImageCount
                    );
                    break;
                  default:
                    startingSentence = getReplyQuestions(
                      this.state.phraseQuestionImageCount
                    );

                    break;
                }
                console.log(
                  "Yo honita data ta persisted ",
                  this.state.logDataPersist
                );
                if (holdingFinalTranscript.length > 0) {
                  // Here we merge the last log data with textForlog with holdinFinalTranscript
                  logDataPersist[logDataPersist.length - 1].textForLog =
                    logDataPersist[logDataPersist.length - 1].textForLog +
                    " " +
                    holdingFinalTranscript;
                  console.log(
                    "WHATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT MY LAST LOGGGGGGGGGG",
                    logDataPersist
                  );
                }

                logData.push({
                  command: "Start",
                  time: Utils.getCurrentTime(),
                  text: "Has begun the task at : " + Utils.getCurrentTime(),
                  textForLog: startingSentence
                });
              }
              holdingFinalTranscript = "";
              interimTranscript = this.concatTranscripts(
                interimTranscript,
                this.containsCommands(event.results[i][0].transcript.trim())
                  ? this.removeLastWord(event.results[i][0].transcript)
                  : event.results[i][0].transcript
              );
            }
          }
        }

        this.setState({
          finalTranscript,
          interimTranscript,
          commands,
          hasCommand,
          hasSelectCommand,
          hasNextCommand,
          phraseQuestionImageCount,
          imageNumber,
          mappingNumber,
          spellMode,
          oldTranscript,
          toCorrectInSpellModeWord,
          suggestionMode,
          suggestionList,
          suggestionListNumber,
          logData,
          logDataPersist
        });
      }

      concatTranscripts(...transcriptParts) {
        return transcriptParts
          .map(t => t.trim())
          .join(" ")
          .trim();
      }

      resetTranscript = () => {
        interimTranscript = "";
        finalTranscript = "";
        this.disconnect("RESET");
        this.setState({ interimTranscript, finalTranscript });
      };

      startListening = () => {
        if (recognition && !listening) {
          if (!recognition.continuous) {
            this.resetTranscript();
          }
          try {
            recognition.start();
          } catch (DOMException) {
            // Tried to start recognition after it has already started - safe to swallow this error
          }
          listening = true;
          this.setState({ listening });
        }
      };

      abortListening = () => {
        listening = false;
        this.setState({ listening });
        this.disconnect("ABORT");
      };

      stopListening = () => {
        listening = false;
        this.setState({ listening });
        this.disconnect("STOP");
      };

      render() {
        // This is to make sure we do not have a race condition
        if (this.state.hasNextCommand) {
          console.log(
            "LAst maaaaaaaaaaaaaaaaaaaaaaaaaaaaa ta finalscript zero bhayo bhaneko ta",
            finalTranscript
          );
          if (finalTranscript) {
            holdingFinalTranscript = finalTranscript;
          }
          // If finalscript not null then we need to update the logdata value
          finalTranscript = "";
        }
        let transcript = this.concatTranscripts(
          finalTranscript,
          interimTranscript
        );

        /** OBJECT CREATION FOR EACH WORD BEGINS */
        let transcriptObject = [];
        if (this.state.spellMode) {
          // If we have a spell mode we should use new transcript only, hence we remove old transcript
          const oldTranscriptLength = this.state.oldTranscript.split(" ")
            .length;
          for (const [index, word] of transcript.split(" ").entries()) {
            if (index >= oldTranscriptLength) {
              let showSuggestionBool =
                this.state.mappingNumber &&
                index + 1 === this.state.mappingNumber + oldTranscriptLength
                  ? true
                  : false;
              transcriptObject.push({
                text: word,
                showSuggestion: showSuggestionBool,
                suggestions: this.obtainSuggestionForLetter(word),
                spellMode: this.state.spellMode
              });
            }
          }
        } else if (this.state.suggestionMode) {
          // If we have suggestion list mode our transcript is going to replaced by the suggestionListnumber
          // Get suggestion list number
          // Get suggestionList
          // replace transcript at mapping number position with suggestionlist[suggestionlistnumber]
          let toReplaceWord = "";
          let replacingWord = "";
          for (const [index, word] of transcript.split(" ").entries()) {
            // if we have index matching mapping number we replace that with suggestionlist[suggestionlistnumber]
            let updatedWord = word;
            if (index + 1 === this.state.mappingNumber) {
              updatedWord = this.state.suggestionList[word][
                this.state.suggestionListNumber
              ];

              toReplaceWord = word;
              replacingWord = updatedWord;
              console.log(
                "WHATTTTTTTTTTT IS MY UPDATEDDDDDDD WORD",
                replacingWord
              );
              console.log("WHATTTTTTTTTTT IS MY toReplace WORD", toReplaceWord);
            }

            transcriptObject.push({
              text: updatedWord,
              showSuggestion: false,
              spellMode: this.state.spellMode
            });
          }
          finalTranscript = this.replaceWordWithSuggestionWord(
            toReplaceWord,
            replacingWord,
            finalTranscript
          );
        } else {
          // This is normal tanscript
          for (const [index, word] of transcript.split(" ").entries()) {
            let showSuggestionBool =
              this.state.mappingNumber && index + 1 === this.state.mappingNumber
                ? true
                : false;
            transcriptObject.push({
              text: word,
              showSuggestion: showSuggestionBool,
              spellMode: this.state.spellMode
            });
          }
        }
        /** OBJECT CREATION FOR EACH WORD ENDS */

        return (
          <WrappedComponent
            resetTranscript={this.resetTranscript}
            startListening={this.startListening}
            abortListening={this.abortListening}
            stopListening={this.stopListening}
            setSuggestionList={this.setSuggestionList}
            logTimeDataWhenHoveredAtWord={this.logTimeDataWhenHoveredAtWord}
            handleWordClickToGetToMappingWithNumberState={
              this.handleWordClickToGetToMappingWithNumberState
            }
            transcript={transcript}
            transcriptObject={transcriptObject}
            recognition={recognition}
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
            {...this.state}
            {...this.props}
          />
        );
      }
    };
  };

  if (typeof options === "function") {
    return SpeechRecognitionInner(options);
  } else {
    return SpeechRecognitionInner;
  }
}
