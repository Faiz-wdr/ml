/**
 * High-Frequency Malayalam Dictionary & Phonetic Variations Dataset
 * Designed as an independent data module (can be bundled, updated, or loaded dynamically).
 */

export interface DictionaryEntry {
  word: string // Malayalam Unicode
  keys: string[] // Manglish phonetic variants (lowercase)
  freq: number // Frequency / priority score (1 - 100)
}

export const COMMON_MALAYALAM_DICTIONARY: DictionaryEntry[] = [
  // Greetings & Courtesies
  { word: 'നമസ്കാരം', keys: ['namaskaram', 'namaskaraam', 'namaskaramu'], freq: 100 },
  { word: 'നന്ദി', keys: ['nanni', 'nandi', 'nandhi'], freq: 95 },
  { word: 'സുഖം', keys: ['sukham', 'sugham', 'sukhm'], freq: 95 },
  { word: 'സുഖമാണോ', keys: ['sukhamano', 'sughamano', 'sukhamanoo'], freq: 90 },

  // Pronouns
  { word: 'ഞാൻ', keys: ['njan', 'njaan', 'njān', 'njanu'], freq: 100 },
  { word: 'എന്റെ', keys: ['ente', 'entey', 'ende'], freq: 100 },
  { word: 'നീ', keys: ['nee', 'ni'], freq: 90 },
  { word: 'നിന്റെ', keys: ['ninte', 'nindey', 'nintey'], freq: 90 },
  { word: 'അവൻ', keys: ['avan', 'avann'], freq: 85 },
  { word: 'അവൾ', keys: ['aval', 'avall'], freq: 85 },
  { word: 'അവർ', keys: ['avar', 'avaru'], freq: 85 },
  { word: 'നമ്മൾ', keys: ['nammal', 'nammall', 'nammalu'], freq: 95 },
  { word: 'ഞങ്ങൾ', keys: ['njangal', 'njangall', 'njangalu'], freq: 95 },
  { word: 'ഞങ്ങൾക്ക്', keys: ['njangalkku', 'njangalku'], freq: 90 },
  { word: 'നിങ്ങൾ', keys: ['ningal', 'ningall', 'ningalu'], freq: 95 },
  { word: 'നിങ്ങൾക്ക്', keys: ['ningalkku', 'ningalku'], freq: 90 },
  { word: 'നമുക്ക്', keys: ['namukku', 'namuku'], freq: 90 },
  { word: 'എനിക്ക്', keys: ['enikku', 'eniku'], freq: 95 },
  { word: 'നിനക്ക്', keys: ['ninakku', 'ninaku'], freq: 90 },

  // Interrogatives
  { word: 'എന്താ', keys: ['entha', 'endha', 'enthaa'], freq: 95 },
  { word: 'എന്ത്', keys: ['enth', 'enthu'], freq: 95 },
  { word: 'എവിടെ', keys: ['evide', 'evidey'], freq: 95 },
  { word: 'എങ്ങനെ', keys: ['engane', 'enganey'], freq: 95 },
  { word: 'എപ്പോൾ', keys: ['eppol', 'eppool'], freq: 90 },
  { word: 'ആര്', keys: ['aaru', 'aar'], freq: 85 },
  { word: 'എത്ര', keys: ['ethra'], freq: 85 },
  { word: 'ഏത്', keys: ['eathu', 'ethu', 'eath'], freq: 85 },

  // Deictics / Adverbs of Place
  { word: 'ഇവിടെ', keys: ['ivide', 'ividey'], freq: 95 },
  { word: 'അവിടെ', keys: ['avide', 'avidey'], freq: 95 },
  { word: 'ഇത്', keys: ['ith', 'ithu'], freq: 95 },
  { word: 'അത്', keys: ['ath', 'athu'], freq: 95 },
  { word: 'ഇങ്ങനെ', keys: ['ingane', 'inganey'], freq: 90 },
  { word: 'അങ്ങനെ', keys: ['angane', 'anganey'], freq: 90 },

  // Common Verbs & Copulas
  { word: 'ആണ്', keys: ['aanu', 'aann', 'anu'], freq: 100 },
  { word: 'ആണ്', keys: ['aane', 'aan'], freq: 95 },
  { word: 'അല്ല', keys: ['alla'], freq: 90 },
  { word: 'ഉണ്ട്', keys: ['undu', 'und'], freq: 95 },
  { word: 'ഇല്ല', keys: ['illa'], freq: 95 },
  { word: 'ചെയ്യുന്നു', keys: ['cheyyunnu', 'cheyunnu'], freq: 90 },
  { word: 'ചെയ്തു', keys: ['cheythu', 'cheydu'], freq: 90 },
  { word: 'ചെയ്യാം', keys: ['cheyyam', 'cheyyaam'], freq: 90 },
  { word: 'വന്നു', keys: ['vannu', 'vanu'], freq: 90 },
  { word: 'വരുന്നു', keys: ['varunnu'], freq: 90 },
  { word: 'വരും', keys: ['varum'], freq: 90 },
  { word: 'പോയി', keys: ['poyi', 'poyee'], freq: 90 },
  { word: 'പോകുന്നു', keys: ['pokunnu', 'pogunnu'], freq: 90 },
  { word: 'കണ്ടു', keys: ['kandu'], freq: 90 },
  { word: 'കാണുന്നു', keys: ['kaanunnu', 'kanunnu'], freq: 85 },
  { word: 'പറഞ്ഞു', keys: ['paranju', 'parannu'], freq: 90 },
  { word: 'പറയൂ', keys: ['parayoo', 'parayu'], freq: 85 },
  { word: 'കേട്ടു', keys: ['kettu'], freq: 85 },
  { word: 'അറിയാം', keys: ['ariyam'], freq: 90 },
  { word: 'അറിയില്ല', keys: ['ariyilla'], freq: 90 },

  // Common Nouns
  { word: 'മലയാളം', keys: ['malayalam', 'malayaalam'], freq: 100 },
  { word: 'കേരളം', keys: ['kerala', 'keralam'], freq: 100 },
  { word: 'പേര്', keys: ['peru', 'paeru', 'per'], freq: 100 },
  { word: 'അമ്മ', keys: ['amma'], freq: 95 },
  { word: 'അച്ഛൻ', keys: ['achan', 'acchan', 'achchan'], freq: 95 },
  { word: 'ചേട്ടൻ', keys: ['chetan', 'chettan'], freq: 90 },
  { word: 'ചേച്ചി', keys: ['chechi'], freq: 90 },
  { word: 'അനിയൻ', keys: ['aniyan'], freq: 85 },
  { word: 'വീട്', keys: ['veedu', 'veed'], freq: 95 },
  { word: 'വെള്ളം', keys: ['vellam'], freq: 95 },
  { word: 'മഴ', keys: ['mazha', 'mala'], freq: 95 },
  { word: 'പുഴ', keys: ['puzha'], freq: 85 },
  { word: 'നാട്', keys: ['naadu', 'nad'], freq: 90 },
  { word: 'രാജ്യം', keys: ['rajyam'], freq: 80 },
  { word: 'സ്ഥലം', keys: ['sthalam'], freq: 85 },
  { word: 'സമയം', keys: ['samayam'], freq: 90 },
  { word: 'ദിവസം', keys: ['divasam'], freq: 85 },
  { word: 'കാര്യം', keys: ['kaaryam', 'karyam'], freq: 90 },
  { word: 'സുഹൃത്ത്', keys: ['suhruth', 'suhruthu'], freq: 85 },
  { word: 'സുഹൃത്തുക്കൾ', keys: ['suhruthukkal'], freq: 80 },
  { word: 'വണ്ടി', keys: ['vandi'], freq: 85 },
  { word: 'മണ്ടൻ', keys: ['mandan'], freq: 80 },

  // Common Proper Names & Loans
  { word: 'ഫൈസ്', keys: ['faiz', 'faise'], freq: 95 },
  { word: 'മുഹമ്മദ്', keys: ['muhammed', 'mohammed'], freq: 85 },
  { word: 'രാഹുൽ', keys: ['rahul'], freq: 80 },
  { word: 'വിഷ്ണു', keys: ['vishnu'], freq: 80 },

  // Conjunctions / Connectives
  { word: 'പക്ഷേ', keys: ['pakshe'], freq: 90 },
  { word: 'എങ്കിൽ', keys: ['enkil'], freq: 90 },
  { word: 'അല്ലെങ്കിൽ', keys: ['allenkil', 'allengil'], freq: 90 },
  { word: 'കാരണം', keys: ['karanam'], freq: 85 },
  { word: 'പോലെ', keys: ['pole', 'poley'], freq: 90 },
  { word: 'മാത്രം', keys: ['mathram', 'maathram'], freq: 90 },
  { word: 'കൂടി', keys: ['koodi', 'kudi'], freq: 90 },
  { word: 'തന്നെ', keys: ['thanne'], freq: 95 },
  { word: 'നല്ല', keys: ['nalla'], freq: 95 },
  { word: 'ശാന്തി', keys: ['shanthi', 'shanthy', 'santhi'], freq: 85 },
  { word: 'വളരെ', keys: ['valare'], freq: 90 },
]
