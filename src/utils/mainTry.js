var text = require("./phrases.jsx");
const fetch = require("node-fetch");

function pause(milliseconds) {
  var dt = new Date();
  while (new Date() - dt <= milliseconds) {
    /* Do nothing */
  }
}

// let arrWords = text.getSuggestion();
let arrWords = `a
academic
activities
add
after
all
alligators
alone
although
aluminium
always
ambiguous
ambulance
an
and
anecdotal
annoying
answer
any
appeles
appetizers
appointed
appreciated
aptitude
are
arm
as
ask
at
atheletic
attitude
audition
audits
authorization
bagpipes
ball
based
bayou
be
beautiful
bidding
bilogists
bongos
bought
bowl
boy
cake
can
cannot
capable
carry
case
catastrophic
cement
chamber
citizenship
clasp
coconut
coincided
coleslaw
companions
company
contains
contributions
corner
costumes
couried
cream
cubic
cut
cutbacks
dad
dark
day
deadline
dessert
destroy
did
diploma
disguise
dislikes
do
doctor
doctors
dont
down
drenched
drugs
drunkard
dwarf
each
early
easy
economic
edge
employee
encyclopedias
enjoy
even
evening
every
everyfile
evidence
execute
eyestrain
fashion
flimsy
for
freely
friends
from
geese
gives
glue
go
got
government
greasy
greatly
grows
guess
gurantees
had
hallway
hand
hats
hauling
have
help
her
hierarchies
high
him
hires
his
hispanic
huge
hung
I
ices
iguanas
in
into
intruments
is
isotopes
it
kayak
lawyer
lay
layoffs
left
lifelong
light
like
loads
made
makes
mango
many
me
measured
medieval
microoragnisms
mollusks
mom
more
morning
most
museum
musical
musicians
my
near
neglect
new
nice
no
noise
objects
of
off
official
often
oil
oily
on
oout
oozed
opens
out
outcast
papaya
paper
participate
patient
peck
people
pewter
pic
player
point
pond
poor
postponed
potatoes
prescibe
present
presented
previous
problem
prowler
question
radioactive
rag
rain
reading
related
remained
reorganization
reptiles
results
rise
rob
roll
sat
screw
seldom
serve
she
silverware
simple
sketched
skimask
small
social
societies
sought
speaker
straw
stray
strongly
students
study
suit
surpriseing
survive
swing
symbols
tapestry
that
the
they
thick
this
three
to
too
took
trait
tropical
tube
tugboats
two
uninterrupted
upbeat
us
use
vocabulary
wall
was
wash
water
we
welcome
were
when
who
will
wire
with
wore
yards
year
you
young
your`;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require("fs");

let toCreateSuggestionWord = arrWords.split("\n");
console.log(toCreateSuggestionWord);
// toCreateSuggestionWord = toCreateSuggestionWord.slice(0, 10);

let newDict = {};

let request = new XMLHttpRequest();
toCreateSuggestionWord.map((word, index) => {
  request.open(
    "GET",
    `https://api.datamuse.com//words?sl=${word}&max=6`,
    false
  ); // `false` makes the request synchronous
  request.send(null);
  if (request.status === 200) {
    let myArr = JSON.parse(request.responseText);
    let answer = myArr.map(el => el.word);
    answer.shift();
    console.log(answer);
    newDict[word] = answer;
  }
});

console.log(newDict);
fs.writeFileSync("./suggestions.js", JSON.stringify(newDict), "utf-8");

// arrWords = arrWords.slice(0, 30);
// var fs = require("fs");
// arrWords.map((word, index) => {
//   // if wordbject.text has already been fetched i.e. suggestionlist has it already than ignore fetch.
//   pause(100);
//   fetch(`https://api.datamuse.com//words?sl=${word}&max=5`)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error("Something went wrong");
//       }
//     })
//     .then(data => {
//       let answer = data.map(el => el.word);
//       console.log("Fetched information are: ", data);
//       newDict[word] = answer;
//       fs.writeFileSync("./suggestions.js", JSON.stringify(newDict), "utf-8");
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

/// Even USELESS
// const anAsyncFunction = async word => {
//   pause(1000);
//   return fetch(`https://api.datamuse.com//words?sl=${word}&max=5`)
//     .then(res => res.json())
//     .then(data => {
//       let answer = data.map(el => el.word);
//       newDict[word] = answer;
//       fs.writeFileSync("./suggestions.js", JSON.stringify(newDict), "utf-8");
//     })
//     .catch();
// };

// const getData = async () => {
//   return await Promise.all(arrWords.map(word => anAsyncFunction(word)));
// };

// const data = getData();

// // console.log(newDict);
