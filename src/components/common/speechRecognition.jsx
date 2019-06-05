import React, { Component } from "react";
import Utils from "../../utils/Utils";

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
          spellMode: false,
          oldTranscript: "",
          mappingNumber: null,

          lowercaseMode: false,
          // Part of suggestion - Begins
          suggestionMode: false,
          suggestionListNumber: null,
          suggestionList: [],
          // Part of suggestion - Ends

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
        console.log(toChangeScript);
        toChangeScript = toChangeScript.substring(0, toChangeScript.length - 1);
        return toChangeScript;
      }

      containsCommands(interimWord) {
        return interimWord.endsWith("map") || interimWord.endsWith("done");
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

      obtainSuggestionForWord(word) {
        // call api and set the suggestion list using the word
        // TODO
        return ["suggestion1", "suggestion2", "suggestion3", "spellmode"];
      }

      updateTranscript(event) {
        interimTranscript = "";
        let mappingNumber = null;
        let suggestionListNumber = null;
        let hasCommand = false;
        let spellMode = this.state.spellMode;
        let suggestionMode = this.state.suggestionMode;
        let lowercaseMode = false;
        let oldTranscript = this.state.oldTranscript;
        let toCorrectInSpellModeWord = this.state.toCorrectInSpellModeWord;

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
              if (currentTranscription.endsWith("done")) {
                hasCommand = false;
                spellMode = false;
                mappingNumber = null;
                suggestionMode = false;
                lowercaseMode = false;
                if (this.state.spellMode) {
                  // only if spell mode on we revert transcript back to old transcript
                  // TODO replace the transcript
                  finalTranscript = this.replaceWordWithSpellWord(
                    this.state.oldTranscript,
                    this.state.toCorrectInSpellModeWord,
                    finalTranscript
                  );
                }
              } else if (
                currentTranscription.endsWith("spell") &&
                this.state.mappingNumber
              ) {
                // This is where we will check if selection mode is on and "spell word is in the transcript"
                console.log(
                  "NOWWWWWWWWWWWW I AMMMMMMMMMMM IN SPell MODEEEEEEEEE"
                );
                hasCommand = false; // Still command mode
                spellMode = true;
                suggestionMode = false;
                lowercaseMode = false;
                oldTranscript = this.state.finalTranscript; // we set oldtranscript for future use
                toCorrectInSpellModeWord = this.state.finalTranscript.split(
                  " "
                )[this.state.mappingNumber];
                mappingNumber = null;
              } else if (
                // Here we check if the transcript is a number
                //
                objIsNumberAndVal.check
              ) {
                hasCommand = true;
                spellMode = this.state.spellMode;
                suggestionMode = false;
                lowercaseMode = false;
                mappingNumber = objIsNumberAndVal.value;
              } else if (
                currentTranscription.endsWith("a") &&
                this.state.mappingNumber
              ) {
                console.log(
                  "NOWWWWWWWWWWWW I AMMMMMMMMMMM IN Suggestion List MODEEEEEEEEE"
                );
                suggestionMode = true;
                suggestionListNumber = 0;
                mappingNumber = this.state.mappingNumber;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber
              } else if (
                currentTranscription.endsWith("b") &&
                this.state.mappingNumber
              ) {
                console.log(
                  "NOWWWWWWWWWWWW I AMMMMMMMMMMM IN Suggestion List MODEEEEEEEEE"
                );
                suggestionMode = true;
                suggestionListNumber = 1;
                mappingNumber = this.state.mappingNumber;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber
              } else if (
                currentTranscription.endsWith("c") &&
                this.state.mappingNumber
              ) {
                console.log(
                  "NOWWWWWWWWWWWW I AMMMMMMMMMMM IN Suggestion List MODEEEEEEEEE"
                );
                suggestionMode = true;
                suggestionListNumber = 2;
                mappingNumber = this.state.mappingNumber;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber
              } else if (
                currentTranscription.endsWith("lowercase") &&
                this.state.mappingNumber
              ) {
                console.log(
                  "NOWWWWWWWWWWWW I AMMMMMMMMMMM GOING TO MAKE LOWERCASE"
                );
                suggestionMode = false;
                lowercaseMode = true;
                // No spell mode but we have suggestion list number set, which means we want to select from suggestion list
                // get suggestion list array
                // depending on the transcript as alpha, beta, charlie ... we set which withinmappingNumber
              } else {
                // Firstly we come here when we say "map " and after that If no "Done" , If no "spell" , if no "number"
                // We do nothing
                mappingNumber = this.state.mappingNumber;
                hasCommand = true;
                spellMode = this.state.spellMode;
                suggestionMode = this.state.suggestionMode;
                lowercaseMode = this.state.lowercaseMode;
              }
            } else {
              // Even interim results has some command then execute it.
              mappingNumber = this.state.mappingNumber;
              hasCommand = true;
              spellMode = this.state.spellMode;
              suggestionMode = this.state.suggestionMode;
              lowercaseMode = this.state.lowercaseMode;
            }
          }
        } else {
          /**
           * when the real transcription happens. It will not come here when we say "map" because command mode is in place.
           */
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              let ifContainsMap = event.results[i][0].transcript
                .trim()
                .endsWith("map");

              if (ifContainsMap) {
                commands.push("map");
                hasCommand = true;
              }
              // If we say map and go to spell mode and now in that state we say "a" "b" "c" and say done then we come here
              if (
                this.state.spellMode &&
                event.results[i][0].transcript.trim().endsWith("done")
              ) {
                spellMode = false;
                // This is where we will have to replace the spell mode text
                finalTranscript = this.replaceWordWithSpellWord(
                  this.state.oldTranscript,
                  this.state.toCorrectInSpellModeWord,
                  finalTranscript
                );
              }
              // finalscript k bhayo ta
              else {
                finalTranscript = this.concatTranscripts(
                  finalTranscript,
                  ifContainsMap
                    ? event.results[i][0].transcript.substring(
                        0,
                        event.results[i][0].transcript.lastIndexOf(" ")
                      )
                    : event.results[i][0].transcript
                );
              }
            } else {
              interimTranscript = this.concatTranscripts(
                interimTranscript,
                this.containsCommands(event.results[i][0].transcript.trim())
                  ? ""
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
          mappingNumber,
          spellMode,
          oldTranscript,
          toCorrectInSpellModeWord,
          suggestionMode,
          suggestionListNumber,
          lowercaseMode
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
        let transcript = this.concatTranscripts(
          finalTranscript,
          interimTranscript
        );

        console.log(
          "SUGGESTION NUMBER FOR WORD IS : ",
          this.state.mappingNumber
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
                index === this.state.mappingNumber + oldTranscriptLength
                  ? true
                  : false;
              transcriptObject.push({
                text: word,
                showSuggestion: showSuggestionBool,
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
            if (index === this.state.mappingNumber) {
              updatedWord = this.obtainSuggestionForWord(word)[
                this.state.suggestionListNumber
              ];
              toReplaceWord = word;
              replacingWord = updatedWord;
            }

            transcriptObject.push({
              text: updatedWord,
              showSuggestion: false,
              suggestions: this.obtainSuggestionForWord(word),
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
              this.state.mappingNumber && index === this.state.mappingNumber
                ? true
                : false;
            transcriptObject.push({
              text: this.state.lowercaseMode ? word.toLocaleLowerCase() : word,
              showSuggestion: showSuggestionBool,
              suggestions: this.obtainSuggestionForWord(word),
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
