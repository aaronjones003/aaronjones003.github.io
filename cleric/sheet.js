import priestSpells from "./priest-spells.js";
import priestSpellSlots from "./priest-spell-slots.js";

let mHideInstructionTimeout = null;

const Classes = {
	CLERIC: 'CLERIC',
}

function getLevel() {
	const levelInput = document.getElementById("level-input");
	return parseInt(levelInput.value);
}

function getClass() {
	const charClass = document.getElementById("character-class-input").value;
	return Object.values(Classes).find((val) => {
		if (charClass.toUpperCase().includes(val)) {
			return val;
		}
	}) || '';
}

function isCleric() {
	return getClass() === Classes.CLERIC;
}

function onSetMovement()
{
	let base = document.getElementById("base-movement");
	let m = parseInt(base.value);
	let t = base.parentElement.parentElement.parentElement;
	t.children[1].children[2].children[0].value = Math.floor(m * 2 / 3);
	t.children[2].children[2].children[0].value = Math.floor(m / 2);
	t.children[3].children[2].children[0].value = Math.floor(m / 3);
	t.children[4].children[2].children[0].value = Math.min(m, 1);
	t.children[5].children[2].children[0].value = Math.floor(m * 2);
	t.children[6].children[2].children[0].value = Math.floor(m * 3);
	t.children[7].children[2].children[0].value = Math.floor(m * 4);
	t.children[8].children[2].children[0].value = Math.floor(m * 5);
}

function onSetThac()
{

	let base = document.getElementById("thac0-input");
	let thac0 = parseInt(base.value);
	let tr = base.parentElement.parentElement.parentElement;
	console.log(tr);
	Array.from(tr.children).forEach((td, i) => {
		// Skip first cell and input cell
		if (i === 0 || i === 11) return;
		td.children[0].innerHTML = thac0 - (11 - i);
	});
}

function onSetLevel()
{

	let levelInput = document.getElementById("level-input");
	let charLevel = parseInt(levelInput.value);
	let turningContainer = document.getElementById("turning");
	let turningRow = turningContainer.children[0].children[0].children[0];
	Array.from(turningRow.children).forEach((td, i) => {
		if (charLevel > turningTable.length) {
			charLevel = turningTable.length;
		}
		td.children[0].value = turningTable[charLevel - 1][i];
	});

	const spellSlots = getSpellSlots();
	const spellsContainer = document.getElementById("spells");
	const spellsRow = spellsContainer.children[0].children[0].children[0]
	console.log(spellsRow)
	Array.from(spellsRow.children).forEach((td, i) => {
		console.log(spellSlots[i+1])
		if (spellSlots[i+1]) {
			td.children[0].value = spellSlots[i+1]
		} else {
			td.children[0].value = '-'
		}
	});
}

const sphereNameTransforms = {
	elem: 'ELEMENTAL',
    necro: 'NECROMANTIC',
    necromancy: 'NECROMANTIC',
};

function getSpellSlots() {
	const charLevel = getLevel();

	const slots = {}
	if (isCleric()) {
		priestSpellSlots[charLevel-1].forEach((val, i) => {
			slots[i+1] = val;
		})
	}
	
	const wisdomlInput = document.getElementById("wis-input");
	const wisdom = parseInt(wisdomlInput.value);
	const wisModifiers = mWisdom[wisdom-1][1]
	wisModifiers.split(' ').forEach(mod => {
		if (slots[mod]) {
			slots[mod] += 1;
		}
	})

	return slots;
	
}

function addSpellsForSphere(spellsByLevel, existingSpells, origSphere, major) {
	priestSpells.forEach(spell => {
		let sphereWords = origSphere.trim().split(' ')
		Object.entries(sphereNameTransforms).forEach(([match, replace]) => {
			const regEx = new RegExp(match, "ig");
			sphereWords = sphereWords.map(word => word.replaceAll(regEx, replace));
		})

		console.log(sphereWords)

		const sphere = sphereWords.join(' ')

		if (existingSpells.has(spell.spellName)) return;

		if (spell.sphere === sphere.trim().toUpperCase() && (major || (spell.spellLevel <= 3))) {
			if (spellsByLevel[spell.spellLevel]) {
				spellsByLevel[spell.spellLevel].push(spell);
				existingSpells.add(spell.spellName);
			} else {
				spellsByLevel[spell.spellLevel] = [spell];
				existingSpells.add(spell.spellName);
			}
		}
	})
}

function onSetSpheres()
{
	let majorInput = document.getElementById("major-spheres-input");
	let majorSpheres = majorInput.value ? [...majorInput.value.split(','), 'ALL'] : ['ALL'];
	let minorInput = document.getElementById("minor-spheres-input");
	let minorSpheres = minorInput.value ? minorInput.value.split(',') : [];
	const spellsByLevel = {}
	const existingSpells = new Set();

	majorSpheres?.forEach(sphere => addSpellsForSphere(spellsByLevel, existingSpells, sphere, true));
	minorSpheres?.forEach(sphere => addSpellsForSphere(spellsByLevel, existingSpells, sphere, false));
	const spheres = new Set(Object.values(spellsByLevel).flatMap(values => values.map(val => val.sphere)))

	const spellsList = Object.entries(spellsByLevel).flatMap(([level, values]) => {
		console.log(getSpellSlots()[level])
		if (getSpellSlots()[level]) {
			return values
		} 
	})

	let spells = document.getElementById("spell-list");
	let rows = spells.querySelectorAll("tbody tr");

	const numRows = rows.length - 1
	Array.from(rows).slice(1).forEach((row, i) => {
		if (spellsList[i]) {

			row.children[0].children[0].children[0].value = spellsList[i].spellName.toLowerCase();
			row.children[1].children[0].children[0].value = spellsList[i].spellLevel;
			row.children[4].children[0].children[0].checked = spellsList[i].components.includes('V');
			row.children[5].children[0].children[0].checked = spellsList[i].components.includes('S');
			row.children[6].children[0].children[0].checked = spellsList[i].components.includes('M');
		} else {
			row.children[0].children[0].children[0].value = '';
			row.children[1].children[0].children[0].value = '';
			row.children[4].children[0].children[0].checked = false;
			row.children[5].children[0].children[0].checked = false;
			row.children[6].children[0].children[0].checked = false;
		}
		if (spellsList[i + numRows]) {
			row.children[7].children[0].children[0].value = spellsList[i + numRows].spellName.toLowerCase();
			row.children[8].children[0].children[0].value = spellsList[i + numRows].spellLevel;
			row.children[11].children[0].children[0].checked = spellsList[i].components.includes('V');
			row.children[12].children[0].children[0].checked = spellsList[i].components.includes('S');
			row.children[13].children[0].children[0].checked = spellsList[i].components.includes('M');
		} else {
			row.children[7].children[0].children[0].value = '';
			row.children[8].children[0].children[0].value = '';
			row.children[11].children[0].children[0].checked = false;
			row.children[12].children[0].children[0].checked = false;
			row.children[13].children[0].children[0].checked = false;
		}
		
	})
}

function findOwner(e)
{
	if (e == null) return null;
	if (e.id != null && e.id.length > 0) return e;
	
	return findOwner(e.parentElement);
}

function showMenu()
{
	let instructions = document.getElementById("menu");
	instructions.classList.remove("collapsed");
}

function hideMenu()
{
	let instructions = document.getElementById("menu");
	instructions.classList.add("collapsed");
}

function showInstructions()
{
	let instructions = document.getElementById("instructions");
	instructions.classList.remove("hidden")
}

function hideInstructions()
{
	if (mHideInstructionTimeout != null)
	{
		clearTimeout(mHideInstructionTimeout);
		mHideInstructionTimeout = null;
	}

	let instructions = document.getElementById("instructions");
	instructions.classList.add("hidden")
}

function generateCharacterJSON() {
	var file = {}
	let data = {};
	
	let inputs = document.querySelectorAll("input, textarea, img");
	for (let i=0; i<inputs.length; i++)
	{
		let input = inputs[i];
        
        if (input.classList.contains("non-serialized")) continue;
                
		let owner = findOwner(input);
		let id = owner.id;
		if (owner != input)
		{
			id += "/" + Array.from(owner.querySelectorAll("input, textarea")).findIndex(e => e == input);
		}

		if (input.nodeName == "INPUT" && input.getAttribute("type") == "checkbox")
		{
			data[id] = input.checked;
		}
        else if (input.nodeName == "IMG")
        {
			data[id] = input.src;
        }
		else
		{
			data[id] = input.value;
		}
	}
	
	let c = document.getElementById('pencil-colour');
	let font_list = document.getElementById("font-selector");

	file.version = 3;
	file.data = data;
	file.font = font_list.value;
	file.colour = c.value.trim();

	return file;
}

function save()
{
	const file = generateCharacterJSON();
	
	localStorage.setItem("character", JSON.stringify(file));
}

function download()
{
	const file = generateCharacterJSON();
	
	let uri = encodeURI("data:application/json;charset=utf-8," + JSON.stringify(file));
	uri = uri.replace(/#/g, '%23')
	let link = document.createElement("a");
	link.setAttribute("href", uri);
	let character_name = document.getElementById("character-name").value
	if (character_name == '') character_name = "unnamed"
	link.setAttribute("download", character_name + ".json");
	document.body.appendChild(link); // Required for FF
	link.click();
	link.remove();
}

function characterFromFile(file)
{
	let version = file.version
	let data = file.data

    // Reset portrait
    setImage(document.getElementById("portrait-image"), "");
	
	if (version >= 3)
	{
		let font_list = document.getElementById("font-selector");
		font_list.value = file.font;
		font_list.onchange();
		
		let c = document.getElementById('pencil-colour');
		c.value = file.colour;
		c.onchange();
	}
	
	for (let i in data)
	{
		let value = data[i];
		let element = null;
		if (!i.includes('/'))
		{
			element = document.getElementById(i)
		}
		else
		{
			let id = i.split('/')[0];
			let index = i.split('/')[1];
			if (version == 1 && id == 'spell-list')
			{
				index--;
				index = Math.floor(index / 6) * 14 + (index % 6);
				index++;
			}
			element = document.getElementById(id).querySelectorAll("input, textarea")[index];
		}
		
		if (element.nodeName == "INPUT" && element.getAttribute("type") == "checkbox")
		{
			element.checked = value;
		}
		else if (element.nodeName == "INPUT" && element.getAttribute("type") == "file")
		{
			// Ignore file uploads, this input isn't data we actually store.
		}
		else if (element.nodeName == "IMG")
		{
            setImage(element, value);
		}
		else if (element.nodeName == "IMG")
		{
            setImage(element, value);
		}
		else
		{
			element.value = value;
		}
	}	

	hideInstructions();
    updateGearWeight();
	onSetThac();
	onSetSpheres();
}

function load() {
	const file = JSON.parse(localStorage.getItem("character"));

	characterFromFile(file);
}

function upload() {
	const file = document.getElementById("upload-input").files[0];

	file.text().then((text) => {
		console.log(text)
		
		const file = JSON.parse(text);
		characterFromFile(file)
	});
}

// function closeModal(e)
// {
// 	let bg = document.getElementById("modal-bg")
// 	bg.style.display = 'none'
// }

function onDragEnter(e)
{
	e.preventDefault()
	e.stopPropagation()
}
function onDragLeave(e)
{
	e.preventDefault();
	e.stopPropagation();
}

function onDrop(e)
{
	onDragLeave(e);
	
	e.preventDefault()
	e.stopPropagation()

    let blob = e.dataTransfer.files[0];
    let reader = new FileReader();
    reader.addEventListener("loadend", function()
    {
        let text = reader.result;
		let data = JSON.parse(text)
		characterFromFile(data)
    });
    reader.readAsText(blob)
}

function getNumCols(table)
{
	let cols = 0;
	let cells = table.rows[0].cells;
	for (let c=0; c<cells.length; c++)
	{
		let cell = cells[c];
		cols += (cell.colSpan !== undefined) ? cell.colSpan : 1;
	}
	
	return cols;
}

function updateTabindex()
{
	let inputs = document.querySelectorAll("input, textarea");
	let ordered = new Array(inputs.length);
	for (let i=0; i<inputs.length; i++)
	{
		let input = inputs[i];
		if (input.tabIndex == 0) continue;
		ordered[input.tabIndex - 1] = input;
	}
	let p = 0;
	for (let i=0; i<inputs.length; i++)
	{
		let input = inputs[i];
		if (input.tabIndex != 0) continue;
		while (ordered[p] != null) p++;
		ordered[p] = input;
	}
	for (let i=0; i<ordered.length; i++)
	{
		ordered[i].tabIndex = i + 1;
	}
	
	let tables = document.querySelectorAll("table[vertical-tabindex]");
	for (let t=0; t<tables.length; t++)
	{
		let table = tables[t];
		let reverse = table.getAttribute("reverse-vertical") != null;
		let index = table.querySelector("input, textarea").tabIndex;
		let grouping = parseInt(table.getAttribute("vertical-tabindex"));
		if (isNaN(grouping)) grouping = 1;		
		let cols = getNumCols(table);
		for (let cc=0; cc<cols; cc+=grouping)
		{
			let c = (reverse) ? cols-cc-grouping : cc;
			for (let r=0; r<table.rows.length; r++)
			{
				for (let fc=c; fc<c+grouping; fc++)
				{
					let cell = table.rows[r].cells[fc];
					if (cell == null) continue;
					
					let inputs = cell.querySelectorAll("input, textarea");
					for (let i=0; i<inputs.length; i++)
					{
						let input = inputs[i];
						input.tabIndex = index++;
					}
				}
			}
		}
	}
}

let mStrength =
[
	['-5', '-4',  '1 lb',   '3 lb',  '1',  '0%'],
	['-3', '-2',  '1 lb',   '5 lb',  '1',  '0%'],
	['-3', '-1',  '5 lb',  '10 lb',  '2',  '0%'],
	['-2', '-1', '10 lb',  '25 lb',  '3',  '0%'],
	['-2', '-1', '10 lb',  '25 lb',  '3',  '0%'],
	['-1',  '0', '20 lb',  '55 lb',  '4',  '0%'],
	['-1',  '0', '20 lb',  '55 lb',  '4',  '0%'],
	[ '0',  '0', '35 lb',  '90 lb',  '5',  '1%'],
	[ '0',  '0', '35 lb',  '90 lb',  '5',  '1%'],
	[ '0',  '0', '40 lb', '115 lb',  '6',  '2%'],
	[ '0',  '0', '40 lb', '115 lb',  '6',  '2%'],
	[ '0',  '0', '45 lb', '140 lb',  '7',  '4%'],
	[ '0',  '0', '45 lb', '140 lb',  '7',  '4%'],
	[ '0',  '0', '55 lb', '170 lb',  '8',  '7%'],
	[ '0',  '0', '55 lb', '170 lb',  '8',  '7%'],
	[ '0', '+1', '70 lb', '195 lb',  '9', '10%'],
	['+1', '+1', '85 lb', '220 lb', '10', '13%'],
	[
		['+1', '+2', '110 lb', '255 lb', '11', '16%'],
		['+1', '+3', '135 lb', '280 lb', '12', '20%'],
		['+2', '+3', '160 lb', '305 lb', '13', '25%'],
		['+2', '+4', '185 lb', '330 lb', '14', '30%'],
		['+2', '+5', '235 lb', '380 lb', '15(3)', '35%'],
		['+3', '+6', '335 lb', '480 lb', '16(6)', '40%'],
	],
	['+3',  '+7',   '484 lb',   '640 lb',  '16(8)', '50%'],
	['+3',  '+8',   '535 lb',   '700 lb', '17(10)', '60%'],
	['+4',  '+9',   '635 lb',   '810 lb', '17(12)', '70%'],
	['+4', '+10',   '785 lb',   '970 lb', '18(14)', '80%'],
	['+5', '+11',   '935 lb', '1,130 lb', '18(16)', '90%'],
	['+6', '+12', '1,235 lb', '1,440 lb', '19(17)', '95%'],
	['+7', '+14', '1,535 lb', '1,750 lb', '19(18)', '99%'],
];
let mDexterity =
[
	['-6', '-6', '+5'],
	['-4', '-4', '+5'],
	['-3', '-3', '+4'],
	['-2', '-2', '+3'],
	['-1', '-1', '+2'],
	[ '0',  '0', '+1'],
	[ '0',  '0', '+0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0',  '0'],
	[ '0',  '0', '-1'],
	['+1', '+1', '-2'],
	['+2', '+2', '-3'],
	['+2', '+2', '-4'],
	['+3', '+3', '-4'],
	['+3', '+3', '-4'],
	['+4', '+4', '-5'],
	['+4', '+4', '-5'],
	['+4', '+4', '-5'],
	['+5', '+5', '-6'],
	['+5', '+5', '-6'],
];
let mConstitution =
[
	[    '-3',  '25%',  '30%', '-2', '-'],
	[    '-2',  '30%',  '35%', '-1', '-'],
	[    '-2',  '35%',  '40%',  '0', '-'],
	[    '-1',  '40%',  '45%',  '0', '-'],
	[    '-1',  '45%',  '50%',  '0', '-'],
	[    '-1',  '50%',  '55%',  '0', '-'],
	[     '0',  '55%',  '60%',  '0', '-'],
	[     '0',  '60%',  '65%',  '0', '-'],
	[     '0',  '65%',  '70%',  '0', '-'],
	[     '0',  '70%',  '75%',  '0', '-'],
	[     '0',  '75%',  '80%',  '0', '-'],
	[     '0',  '80%',  '85%',  '0', '-'],
	[     '0',  '85%',  '90%',  '0', '-'],
	[     '0',  '88%',  '92%',  '0', '-'],
	[    '+1',  '90%',  '94%',  '0', '-'],
	[    '+2',  '95%',  '96%',  '0', '-'],
	['+2(+3)',  '97%',  '98%',  '0', '-'],
	['+2(+4)',  '99%', '100%',  '0', '-'],
	['+2(+5)',  '99%', '100%', '+1', '-'],
	['+2(+5)',  '99%', '100%', '+1', '1/6 turns'],
	['+2(+6)',  '99%', '100%', '+2', '1/5 turns'],
	['+2(+6)',  '99%', '100%', '+2', '1/4 turns'],
	['+2(+6)',  '99%', '100%', '+3', '1/3 turns'],
	['+2(+7)',  '99%', '100%', '+3', '1/2 turns'],
	['+2(+7)', '100%', '100%', '+4', '1/1 turns'],
];
let mIntelligence =
[
	[ '0',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '1',   '-',    '-',   '-', '-'],
	[ '2', '4th',  '35%',   '6', '-'],
	[ '2', '5th',  '40%',   '7', '-'],
	[ '2', '5th',  '45%',   '7', '-'],
	[ '3', '6th',  '50%',   '7', '-'],
	[ '3', '6th',  '55%',   '9', '-'],
	[ '4', '7th',  '60%',   '9', '-'],
	[ '4', '7th',  '65%',  '11', '-'],
	[ '5', '8th',  '70%',  '11', '-'],
	[ '6', '8th',  '75%',  '14', '-'],
	[ '7', '9th',  '85%',  '18', '-'],
	[ '8', '9th',  '95%', 'All', '1st-lvl illusions'],
	[ '9', '9th',  '96%', 'All', '2nd-lvl illusions'],
	['10', '9th',  '97%', 'All', '3rd-lvl illusions'],
	['11', '9th',  '98%', 'All', '4th-lvl illusions'],
	['12', '9th',  '99%', 'All', '5th-lvl illusions'],
	['15', '9th', '100%', 'All', '6th-lvl illusions'],
	['20', '9th', '100%', 'All', '7th-lvl illusions'],
];
let mWisdom =
[
	['-6', '-', '80%', '-'],
	['-4', '-', '60%', '-'],
	['-3', '-', '50%', '-'],
	['-2', '-', '45%', '-'],
	['-1', '-', '40%', '-'],
	['-1', '-', '35%', '-'],
	['-1', '-', '30%', '-'],
	[ '0', '-', '25%', '-'],
	[ '0', '0', '20%', '-'],
	[ '0', '0', '15%', '-'],
	[ '0', '0', '10%', '-'],
	[ '0', '0', '5%', '-'],
	[ '0', '1', '0%', '-'],
	[ '0', '1 1', '0%', '-'],
	['+1', '1 1 2', '0%', '-'],
	['+2', '1 1 2 2', '0%', '-'],
	['+3', '1 1 2 2 3', '0%', '-'],
	['+4', '1 1 2 2 3 4', '0%', '-'],
	['+4', '1 1 1 2 2 3 4 4', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism'],
	['+4', '1 1 1 2 2 2 3 4 4 4', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare'],
	['+4', '1 1 1 2 2 2 3 3 4 4 4 5', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare, Fear'],
	['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare, Fear, Charm monster, Confusion, Emotion, Fumble, Suggestion'],
	['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare, Fear, Charm monster, Confusion, Emotion, Fumble, Suggestion, Chaos, Feeblemind, Hold monster, Magic jar, Quest'],
	['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5 6 6', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare, Fear, Charm monster, Confusion, Emotion, Fumble, Suggestion, Chaos, Feeblemind, Hold monster, Magic jar, Quest, Geas, Mass suggestion, Rod of rulership'],
	['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5 6 6 6 7', '0%', 'Cause fear, Charm person, Command, Friends, Hypnotism, Forget, Hold Person, Ray of enfeeblement, Scare, Fear, Charm monster, Confusion, Emotion, Fumble, Suggestion, Chaos, Feeblemind, Hold monster, Magic jar, Quest, Geas, Mass suggestion, Rod of rulership, Antipathy/sympathy, Death spell, Mass charm'],
];
let mCharisma =
[
	[ '0',  '-8', '-7'],
	[ '1',  '-7', '-6'],
	[ '1',  '-6', '-5'],
	[ '1',  '-5', '-4'],
	[ '2',  '-4', '-3'],
	[ '2',  '-3', '-2'],
	[ '3',  '-2', '-1'],
	[ '3',  '-1',  '0'],
	[ '4',   '0',  '0'],
	[ '4',   '0',  '0'],
	[ '4',   '0',  '0'],
	[ '5',   '0',  '0'],
	[ '5',   '0', '+1'],
	[ '6',  '+1', '+2'],
	[ '7',  '+3', '+3'],
	[ '8',  '+4', '+5'],
	['10',  '+6', '+6'],
	['15',  '+8', '+7'],
	['20', '+10', '+8'],
	['25', '+12', '+9'],
	['30', '+14', '+10'],
	['35', '+16', '+11'],
	['40', '+18', '+12'],
	['45', '+20', '+13'],
	['50', '+20', '+14'],
];
const turningTable = [
	[10, 13, 16, 19, 20, "-", "-", "-", "-", "-", "-", "-", "-"],
	[7, 10, 13, 16, 19, 20, "-", "-", "-", "-", "-", "-", "-"],
	[4, 7, 10, 13, 16, 19, 20, "-", "-", "-", "-", "-", "-"],
	["T", 4, 7, 10, 13, 16, 19, 20, "-", "-", "-", "-", "-"],
	["T", "T", 4, 7, 10, 13, 16, 19, 20, "-", "-", "-", "-"],
	["D", "T", "T", 4, 7, 10, 13, 16, 19, 20, "-", "-", "-"],
	["D", "D", "T", "T", 4, 7, 10, 13, 16, 19, 20, "-", "-"],
	["D*", "D", "D", "T", "T", 4, 7, 10, 13, 16, 19, 20, "-"],
	["D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13, 16, 19, 20],
	["D*", "D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13, 16, 19],
	["D*", "D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13, 16, 19],
	["D*", "D*", "D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13, 16],
	["D*", "D*", "D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13, 16],
	["D*", "D*", "D*", "D*", "D*", "D", "D", "T", "T", 4, 7, 10, 13]
]
function updateFromData(inputs, data)
{
	for (let i=0; i<data.length; i++)
	{
		inputs[i].value = data[i];
	}
}
function updateStrength(e)
{
	let value = e.target.value.toString();
	let percentage = '0';
	if (value.includes('/'))
	{
		percentage = value.split('/')[1];
		value = value.split('/')[0];
		if (percentage == '00') percentage = '100';
	}
	value = parseInt(value);
	percentage = parseInt(percentage);
	let data = null;
	if (value == 18)
	{
		if (percentage == 0) data = mStrength[18-1][0];
		else if (percentage <= 50) data = mStrength[18-1][1];
		else if (percentage <= 75) data = mStrength[18-1][2];
		else if (percentage <= 90) data = mStrength[18-1][3];
		else if (percentage <= 99) data = mStrength[18-1][4];
		else data = mStrength[18-1][5];
	}
	else if (value >= 1 && value <= 25)
	{
		data = mStrength[value-1];
	}
	
	if (data == null) return;
	
	let inputs = e.target.parentElement.parentElement.children[2].querySelectorAll("input");
	for (let i=0; i<data.length; i++)
	{
		inputs[i].value = data[i];
	}
}
function updateAbility(e)
{
	let data_table = null;
	switch (e.target.parentElement.parentElement.children[1].innerText)
	{
		case 'STR': return updateStrength(e);
		case 'DEX': data_table = mDexterity; break;
		case 'CON': data_table = mConstitution; break;
		case 'INT': data_table = mIntelligence; break;
		case 'WIS': data_table = mWisdom; break;
		case 'CHA': data_table = mCharisma; break;
	}

	let data = null;
	let value = parseInt(e.target.value.toString());
	if (value >= 1 && value <= 25)
	{
		data = data_table[value-1];
	}

	if (data == null) return;
	
	let inputs = e.target.parentElement.parentElement.children[2].querySelectorAll("input");
	for (let i=0; i<data.length; i++)
	{
		inputs[i].value = data[i];
	}
}

function updateGearWeight()
{
	let gear = document.getElementById("gear");
	let weights = gear.querySelectorAll("td:nth-child(3) input");
	let sum = 0;
	let valid = false;
	for (let i=0; i<weights.length; i++)
	{
		let weight = parseFloat(weights[i].value);
		if (isNaN(weight)) continue;
		
		sum += parseFloat(weights[i].value);
		valid = true;
	}
	
	document.getElementById("gear-total-weight").innerText = (valid) ? sum : "";
}

function cast(e)
{
	e.target.remove();
	e.stopPropagation();
}

function memorize(e)
{
	let x = document.createElement("X");
	x.addEventListener('click', cast);
	e.target.appendChild(x);
	e.stopPropagation();
	e.preventDefault();
}

function updateSpellListMode()
{
	let edit = document.getElementById("spell-list-edit").checked;
	let spells = document.getElementById("spell-list");
	if (edit)
	{
		spells.classList.remove("play");
	}
	else
	{
		spells.classList.add("play");
	}
	let inputs = spells.querySelectorAll("input[type=text]");
	for (let i=0; i<inputs.length; i++)
	{
//		inputs[i].style.pointerEvents = (edit) ? null : "none";
		if (inputs[i].value == '') continue;
		
		if (edit)
		{
			inputs[i].parentElement.removeEventListener('click', memorize, false);
		}
		else
		{
			inputs[i].parentElement.addEventListener('click', memorize, false);
		}
	}
}

function updatePrinterFriendly(e)
{
	let pf = e.target.checked;
	let pages = document.querySelectorAll(".page");
	for (let p=0; p<pages.length; p++)
	{
		let page = pages[p];
		if (pf)
		{
			page.classList.add("printer-friendly");
		}
		else
		{
			page.classList.remove("printer-friendly");
		}
	}
}

function updatePlayerAid(e)
{
	let show_player_aid = e.target.checked;
    let player_aid = document.getElementById("player-aid");
    player_aid.style.display = (show_player_aid) ? "block" : "none";
}

function showFontSelector()
{
	let list = document.getElementById("font-list");
	list.classList.add('visible');
}

function hideFontSelector()
{
	let list = document.getElementById("font-list");
	list.classList.remove('visible');
}

function updateFont()
{
	let list = document.getElementById("font-selector");
	let font = list.value;
	if (font == "Default") font = "Handlee";
	setFont(font);
	hideFontSelector();
}

function setFont(font)
{
	let r = document.querySelector(":root");
	r.style.setProperty('--font', font)
}

function changePencilColour(e)
{
	let c = document.getElementById('pencil-colour');
	let r = document.querySelector(":root");
	r.style.setProperty('--colour', c.value)
}

let gModalCallback = null
function closeModal(e)
{
	var modals = document.querySelectorAll(".modal")
	for (var m=0; m<modals.length; m++)
	{
		modals[m].style.display = 'none'
	}
	var bg = document.getElementById("modal-bg")
	bg.style.display = 'none'
	if (gModalCallback != null)
	{
		gModalCallback()
		gModalCallback = null
	}
}
function showModal(id, left, top, callback)
{
	gModalCallback = callback
	var bg = document.getElementById("modal-bg")
	bg.style.display = 'block'
	var modal = document.getElementById(id)
	modal.style.display = 'block'
	modal.style.left = left
	modal.style.top = top
	var input = modal.querySelector("input");
	if (input != null)
	{
		modal.querySelector("input").select()
	}
}
function setImage(img, url)
{
    img.src = url
    img.setAttribute("data-x", 0)
    img.setAttribute("data-y", 0)
    img.setAttribute("data-zoom", 1)
    img.style.transform = 'translate(0, 0) scale(1)'    
    img.style.display = (url == "") ? "none" : "block";
}
function changeImageURL(e)
{
	var url = document.querySelector("#url-modal input")
	var img = e.target.parentElement.querySelector("img")
	url.value = img.src
	showModal("url-modal", e.pageX, e.pageY, function()
	{
        setImage(img, url.value)
	})
}

window.onload = function()
{
	document.addEventListener("keydown", function(e)
	{
		if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83)
		{
			e.preventDefault()
			save()
		}
	}, false);
	
	document.onclick = (e) =>
	{
		if (e.target.id != "instructions" && e.target.id != "show-instructions") hideInstructions();
		if (e.path && !e.path.some(o => o.id == "font-selection")) hideFontSelector();
	}

	showInstructions();
	mHideInstructionTimeout = setTimeout(() =>
	{
		hideInstructions();
	}, 5000);
	
	updateTabindex();

	let r = document.querySelector(":root");
	let c = document.getElementById('pencil-colour');
	let colour = getComputedStyle(r).getPropertyValue('--colour').trim();
	c.value = colour;

	load();
}

export default {
		onSetMovement,
		onSetThac,
		onSetLevel,
		onSetSpheres,
		changeImageURL,
		closeModal,
		changePencilColour,
		updateSpellListMode,
		updateFont,
		showFontSelector,
		updateGearWeight,
		updatePlayerAid,
		updatePrinterFriendly,
		updateStrength,
		onDragEnter,
		onDrop,
		showMenu,
		hideMenu,
		showFontSelector,
		showInstructions,
		hideInstructions,
		updateAbility,
		save,
		load,
		download,
		upload,
		characterFromFile
	}
