localStorage.setItem("counter", "24");


// Finds the canonical motifs for the input list of Uniprot Codes
function findMotifs(uniprotProteinIDArray) {
  var promises = [];
  // get the canonical motif
  // iterate through the sequences
  for(var i = 0; i < uniprotProteinIDArray.length; i++){
    var uniprotProteinID = uniprotProteinIDArray[i];
    var promise = getAminoAcidSequence(uniprotProteinID)
    .then(proteinInfo => {
        //print Uniprot sequence
        // console.log("Uniprot Sequence:", sequence);

        //use sequence in search
        proteinResult = search(proteinInfo.proteinSequence, proteinInfo.proteinName, proteinInfo.proteinAccession);
//        console.log("Protein Result:", proteinResult);

        return proteinResult;
    })
    .catch(error => {
        console.error('Error:', error);
    });
    promises.push(promise);
  }
    // Wait for all promises to resolve
    return Promise.all(promises)
    .then(proteinResults => {
      // Concatenate all results into a single string
      var resultCanonical = proteinResults.join('');
      return resultCanonical;
    })
    .catch(error => {
      console.error('Error:', error);
      return 'Error occurred while fetching motifs';
    });
}

// find and score main motifs -- canonical
function search(proteinSequence, proteinName, proteinAccession) {
  var canMotifs = '';

  for (var i = 0, _pj_a = proteinSequence.length-6; i < _pj_a; i += 1) {

    // if a motif is found
    if (proteinSequence[i] == 'R' && proteinSequence[i+5] == 'G' && proteinSequence[i+6] != 'P'){

      thisMotif = proteinSequence.substring(i, i+8);
      thisScore = getScore(thisMotif);

      realIndex = i + 1

      // Add motif to new line of table
      canMotifs = canMotifs + proteinName + ',' + proteinAccession + ',' + thisMotif + ',' + realIndex + ',' + thisScore + '\<br>';
    };
  };

  if (canMotifs == ''){
    canMotifs += "No canonical motifs found for " + proteinAccession + " (" + proteinName + ")\<br>";
  }

  return canMotifs;
}

// Finds the extended motifs for the input list of Uniprot Codes
function findExtendedMotifs(uniprotProteinIDArray) {
  var promises = [];
  // get the canonical motif
  // iterate through the sequences
  for(var k = 0; k < uniprotProteinIDArray.length; k++){
    var uniprotProteinID = uniprotProteinIDArray[k];
    var promise = getAminoAcidSequence(uniprotProteinID)
    .then(proteinInfo => {
        motifs = '';
      for (var i = 0, _pj_a = proteinInfo.proteinSequence.length-6; i < _pj_a; i += 1) {
        if (proteinInfo.proteinSequence[i] == 'R' && proteinInfo.proteinSequence[i+8] == 'G'){
          thisMotif = proteinInfo.proteinSequence.substring(i, i+11);
          score = extendedScoring(thisMotif)
          realIndex = i + 1
          motifs = motifs + proteinInfo.proteinName + ','+ proteinInfo.proteinAccession + ',' + thisMotif + ',' + realIndex + ',' + score + '\<br>';
        }
        else if (proteinInfo.proteinSequence[i] == 'R' && proteinInfo.proteinSequence[i+7] == 'G'){
          thisMotif = proteinInfo.proteinSequence.substring(i, i+10);
          score = extendedScoring(thisMotif)
          realIndex = i + 1
          motifs = motifs + proteinInfo.proteinName + ','+ proteinInfo.proteinAccession + ',' + thisMotif + ',' + realIndex + ',' + score + '\<br>';
        }
        else if (proteinInfo.proteinSequence[i] == 'R' && proteinInfo.proteinSequence[i+6] == 'G'){
          thisMotif = proteinInfo.proteinSequence.substring(i, i+9);
          score = extendedScoring(thisMotif)
          realIndex = i + 1
          motifs = motifs + proteinInfo.proteinName + ','+ proteinInfo.proteinAccession + ',' + thisMotif + ',' + realIndex + ',' + score + '\<br>';
        };
      };

      if (motifs == ''){
        motifs += "No extended motifs found for " + proteinInfo.proteinAccession + " (" + proteinInfo.proteinName + ")\<br>";
      }
        return motifs;
    })
    .catch(error => {
        console.error('Error:', error);
    });
    promises.push(promise);
  }
    // Wait for all promises to resolve
    return Promise.all(promises)
    .then(proteinExtendedResults => {
      // Concatenate all results into a single string
      var resultExtended = proteinExtendedResults.join('');
      return resultExtended;
    })
    .catch(error => {
      console.error('Error:', error);
      return 'Error occurred while fetching motifs';
    });
}
// clears text and results from text box
function clearText() {
  document.getElementById("canonical").innerHTML = '';
  document.getElementById("proteins").value = '';
}

// called when score button is pressed
function scoreMotifs(){
  var mot = document.getElementById("8proteins").value;
  if (mot.length != 8){
    document.getElementById("canonical").innerHTML = "Error- sequence must be 8 characters long";
  }
  else{
    document.getElementById("canonical").innerHTML = mot + ' -> score of ' + getScore(mot);
  }

}

// clears text and results from scoring text box
function clearText2() {
  document.getElementById("canonical").innerHTML = '';
  document.getElementById("8proteins").value = '';
}

// clears extended search output
function clearText3() {
  document.getElementById("extended").value = '';
  document.getElementById("extendedOutput").innerHTML = '';
}

// remove new line characters
function modify(seq) {
    var new_seq;
    new_seq = "";

    for (var i = 0, _pj_a = seq.length; i < _pj_a; i += 1) {
      if (seq[i] !== "\n") {
        new_seq = new_seq + seq[i];
      }
    }

    return new_seq;
}

function getScore(thisMotif){

  // score initialized to 0
  thisScore = 0;

  // read in scoring file
  const myJSON = '{"1":{"P":-0.1295336788,"G":-0.1295336788,"A":-0.1295336788,"V":-0.1295336788,"L":-0.1295336788,"I":-0.1295336788,"M":-0.1295336788,"C":-0.1295336788,"S":-0.1295336788,"T":-0.1295336788,"R":0.2590673575,"K":-0.1295336788,"H":-0.1295336788,"D":-0.1295336788,"E":-0.1295336788,"N":-0.1295336788,"Q":-0.1295336788,"W":-0.1295336788,"F":-0.1295336788,"Y":-0.1295336788}, "2":{"P":0.0141450777,"G":0.0130829016,"A":0.0110362694,"V":0.0076943005,"L":0.0186010363,"I":0.0079533679,"M":0.0156994819,"C":0.0099481865,"S":0.0164507772,"T":0.019119171,"R":0.0057512953,"K":0.0050518135,"H":0.0087305699,"D":0.019119171,"E":0.0294559585,"N":0.0066062176,"Q":0.0124093264,"W":0.0117875648,"F":0.0113989637,"Y":0.0150518135}, "3":{"P":0.0265544041,"G":0.0066321244,"A":0.0293264249,"V":0.0094559585,"L":0.0067098446,"I":0.0051036269,"M":0.0118134715,"C":0.0102072539,"S":0.0178238342,"T":0.0099740933,"R":0.014507772,"K":0.0111658031,"H":0.006865285,"D":0.0287046632,"E":0.0270725389,"N":0.0077720207,"Q":0.0151295337,"W":0.0086787565,"F":-0.1295336788,"Y":0.0055958549}, "4":{"P":0.0479792746,"G":0.1759585492,"A":0.0232124352,"V":-0.1295336788,"L":-0.1295336788,"I":-0.1295336788,"M":-0.1295336788,"C":0.0119170984,"S":-0.1295336788,"T":-0.1295336788,"R":-0.1295336788,"K":-0.1295336788,"H":-0.1295336788,"D":-0.1295336788,"E":-0.1295336788,"N":-0.1295336788,"Q":-0.1295336788,"W":-0.1295336788,"F":-0.1295336788,"Y":-0.1295336788}, "5":{"P":-0.1295336788,"G":-0.1295336788,"A":-0.1295336788,"V":0.0178756477,"L":-0.1295336788,"I":0.0098445596,"M":-0.1295336788,"C":0.0093523316,"S":-0.1295336788,"T":-0.1295336788,"R":-0.1295336788,"K":-0.1295336788,"H":-0.1295336788,"D":0.1618134715,"E":0.032357513,"N":-0.1295336788,"Q":0.0153367876,"W":-0.1295336788,"F":-0.1295336788,"Y":0.0124870466}, "6":{"P":-0.1295336788,"G":0.2590673575,"A":-0.1295336788,"V":-0.1295336788,"L":-0.1295336788,"I":-0.1295336788,"M":-0.1295336788,"C":-0.1295336788,"S":-0.1295336788,"T":-0.1295336788,"R":-0.1295336788,"K":-0.1295336788,"H":-0.1295336788,"D":-0.1295336788,"E":-0.1295336788,"N":-0.1295336788,"Q":-0.1295336788,"W":-0.1295336788,"F":-0.1295336788,"Y":-0.1295336788}, "7":{"P":-0.1295336788,"G":0.008238342,"A":0.0186787565,"V":0.0079015544,"L":0.0055699482,"I":0.0103626943,"M":0.0135233161,"C":0.0280310881,"S":0.0154663212,"T":0.0142227979,"R":0.0077979275,"K":0.0079792746,"H":0.0125388601,"D":0.0211398964,"E":0.0305181347,"N":0.0137305699,"Q":0.0197668394,"W":0.007642487,"F":0.0088341969,"Y":0.0070984456}, "8":{"P":0.0121243523,"G":0.008238342,"A":0.0174611399,"V":0.0096891192,"L":0.0066062176,"I":0.0075388601,"M":0.0087305699,"C":0.0124611399,"S":0.0124611399,"T":0.0077979275,"R":0.002642487,"K":0.0023316062,"H":0.0080829016,"D":0.0484974093,"E":0.0545595855,"N":0.0117875648,"Q":0.0067098446,"W":0.0047409326,"F":0.0070466321,"Y":0.0094818653}}';
  const scoreSheet = JSON.parse(myJSON);

  // add score for each of the 8 characters
  for (var i = 1; i < 9; i += 1) {
    // Get char at current position
    currentChar = thisMotif.charAt(i-1);
    // calculate position score based off current position (i) and currentChar at position
    positionScore = scoreSheet[i.toString()][currentChar];
    thisScore += positionScore;
//    console.log(currentChar, positionScore, thisScore)
  }

//  console.log(thisScore);

  return thisScore;
}

function getAminoAcidSequence(uniprotProteinID) {
    // Define the UniProt API endpoint
    const apiUrl = 'https://rest.uniprot.org/uniprotkb';

    return new Promise((resolve, reject) => {
        // Make a GET request to the UniProt API
        fetch(`${apiUrl}/${uniprotProteinID}`)
          .then(response => {
            if (!response.ok) {
              document.getElementById("canonical").innerHTML = "Unable to fetch amino acid sequence for Uniprot code '" + uniprotProteinID + "'. Check that the code is correct and try again.";
              throw new Error('Unable to fetch amino acid sequence.');
            }
            return response.json(); // Parse the JSON response
          })
          .then(data => {
            // Access the protein amino acid sequence
            const sequence = data.sequence.value;
            const name = data.uniProtkbId;
            const accession = data.primaryAccession;
            // Resolve the Promise with the 'sequence' and protein name
            const proteinInfo = {
                proteinSequence: sequence,
                proteinName: name,
                proteinAccession: accession,
            }
            resolve(proteinInfo);

          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    });
}

function findAndScoreMotifs() {
   // get user input
  var uniprotProteinIDList = document.getElementById("proteins").value;
  // translate to an array by splitting on commas and trimming any extra white space
  var uniprotProteinIDArray = uniprotProteinIDList.split('\n').map(item => item.trim());
  uniprotProteinIDArray = uniprotProteinIDArray.filter(value => value !== '');

    //set-up output
    var resultCanonical = "<b>Canonical TBMs: R-x-x-x-x-G-(No Proline)-x: \<br></b>";
    resultCanonical += '<b>Protein,Uniprot Code,Motif,Position,Score \<br></b>';

    var resultExtended = "\<br> \<br> <b>Extended TBMs with 5, 6, or 7 amino acids between R and G: </b> \<br>";
    resultExtended += '<b>Protein,Uniprot Code,Motif,Position,Score\<br></b>';

//   get results
    Promise.all([
        findMotifs(uniprotProteinIDArray),
        findExtendedMotifs(uniprotProteinIDArray)
        ]).then(([canonicalResult, extendedResult]) => {
        // Append the resolved result to resultCanonical here
        resultCanonical += canonicalResult;
        resultExtended += extendedResult;
        // Now you can work with the updated resultCanonical
//        console.log('Extended Result:', extendedResult);

        var resultFinal = resultCanonical + resultExtended;
        document.getElementById("canonical").innerHTML = resultFinal;
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function extendedScoring(input){
    const myJSON = '{"-2":{"P":0.0510192837,"G":0.187107438,"A":0.0246831956,"V":-0.1377410468,"L":-0.1377410468,"I":-0.1377410468,"M":-0.1377410468,"C":0.0126721763,"S":-0.1377410468,"T":-0.1377410468,"R":-0.1377410468,"K":-0.1377410468,"H":-0.1377410468,"D":-0.1377410468,"E":-0.1377410468,"N":-0.1377410468,"Q":-0.1377410468,"W":-0.1377410468,"F":-0.1377410468,"Y":-0.1377410468},"-1":{"P":-0.1377410468,"G":-0.1377410468,"A":-0.1377410468,"V":0.0190082645,"L":-0.1377410468,"I":0.0104683196,"M":-0.1377410468,"C":0.0099449036,"S":-0.1377410468,"T":-0.1377410468,"R":-0.1377410468,"K":-0.1377410468,"H":-0.1377410468,"D":0.1720661157,"E":0.0344077135,"N":-0.1377410468,"Q":0.0163085399,"W":-0.1377410468,"F":-0.1377410468,"Y":0.0132782369},"0":{"P":-0.1377410468,"G":0.2754820937,"A":-0.1377410468,"V":-0.1377410468,"L":-0.1377410468,"I":-0.1377410468,"M":-0.1377410468,"C":-0.1377410468,"S":-0.1377410468,"T":-0.1377410468,"R":-0.1377410468,"K":-0.1377410468,"H":-0.1377410468,"D":-0.1377410468,"E":-0.1377410468,"N":-0.1377410468,"Q":-0.1377410468,"W":-0.1377410468,"F":-0.1377410468,"Y":-0.1377410468},"1":{"P":-0.1377410468,"G":0.0087603306,"A":0.019862259,"V":0.0084022039,"L":0.005922865,"I":0.0110192837,"M":0.0143801653,"C":0.0298071625,"S":0.016446281,"T":0.0151239669,"R":0.008292011,"K":0.0084848485,"H":0.0133333333,"D":0.0224793388,"E":0.0324517906,"N":0.014600551,"Q":0.0210192837,"W":0.0081267218,"F":0.0093939394,"Y":0.0075482094},"2":{"P":0.012892562,"G":0.0087603306,"A":0.0185674931,"V":0.0103030303,"L":0.0070247934,"I":0.0080165289,"M":0.0092837466,"C":0.0132506887,"S":0.0132506887,"T":0.008292011,"R":0.0028099174,"K":0.0024793388,"H":0.0085950413,"D":0.0515702479,"E":0.0580165289,"N":0.0125344353,"Q":0.0071349862,"W":0.0050413223,"F":0.0074931129,"Y":0.0100826446}}'
    const scoreSheet = JSON.parse(myJSON);

    var gIndex = 0;

    for (var i = 6, _pj_a = 9; i < _pj_a; i += 1){
        if (input[i] == 'G'){
          gIndex = i;
        }
    }

    var totalScore = 0;
    var offset = -2;

    while (offset < 3){
        const currentChar = input.charAt(gIndex + offset);

        totalScore += scoreSheet[offset.toString()][currentChar];
//        console.log(scoreSheet[offset.toString()][currentChar]);
        offset += 1;
    }

    return totalScore;
}


// This code here served as good testing for a single protein extended scoring results.
//var motifs = '';
//var thisMotif = '';
//const uniprotProteinID = 'P78314';
//const proteinSequence = 'MAAEEMHWPVPMKAIGAQNLLTMPGGVAKAGYLHKKGGTQLQLLKWPLRFVIIHKRCVYYFKSSTSASPQGAFSLSGYNRVMRAAEETTSNNVFPFKIIHISKKHRTWFFSASSEEERKSWMALLRREIGHFHEKKDLPLDTSDSSSDTDSFYGAVERPVDISLSPYPTDNEDYEHDDEDDSYLEPDSPEPGRLEDALMHPPAYPPPPVPTPRKPAFSDMPRAHSFTSKGPGPLLPPPPPKHGLPDVGLAAEDSKRDPLCPRRAEPCPRVPATPRRMSDPPLSTMPTAPGLRKPPCFRESASPSPEPWTPGHGACSTSSAAIMATATSRNCDKLKSFHLSPRGPPTSEPPPVPANKPKFLKIAEEDPPREAAMPGLFVPPVAPRPPALKLPVPEAMARPAVLPRPEKPQLPHLQRSPPDGQSFRSFSFEKPRQPSQADTGGDDSDEDYEKVPLPNSVFVNTTESCEVERLFKATSPRGEPQDGLYCIRNSSTKSGKVLVVWDETSNKVRNYRIFEKDSKFYLEGEVLFVSVGSMVEHYHTHVLPSHQSLLLRHPYGYTGPR';
//
//for (var i = 0, _pj_a = proteinSequence.length-6; i < _pj_a; i += 1) {
//    if (proteinSequence[i] == 'R' && proteinSequence[i+8] == 'G'){
//      const thisMotif = proteinSequence.substring(i, i+11);
//      var score = extendedScoring(thisMotif);
//      realIndex = i + 1;
//      motifs = motifs + 'proteinInfo.proteinName' + ','+ 'proteinInfo.proteinAccession' + ',' + thisMotif + ',' + realIndex + ',score:' + score + '\<br>';
//    }
//    else if (proteinSequence[i] == 'R' && proteinSequence[i+7] == 'G'){
//      thisMotif = proteinSequence.substring(i, i+10);
//      score = extendedScoring(thisMotif);
//      realIndex = i + 1;
//      motifs = motifs + 'proteinInfo.proteinName' + ','+ 'proteinInfo.proteinAccession' + ',' + thisMotif + ',' + realIndex + ',score:' + score + '\<br>';
//    }
//    else if (proteinSequence[i] == 'R' && proteinSequence[i+6] == 'G'){
//      thisMotif = proteinSequence.substring(i, i+9);
//      score = extendedScoring(thisMotif);
//      realIndex = i + 1;
//      motifs = motifs + 'proteinInfo.proteinName' + ','+ 'proteinInfo.proteinAccession' + ',' + thisMotif + ',' + realIndex + ',score:' + score + '\<br>';
//    };
//};
//
//if (motifs == ''){
//motifs += "No motifs found.";
//}
//console.log('Extended Results:', motifs);