window.PLANDING5 = function (editor, path){




//////////////////////////
//  BASIC
//////////////////////


editor.BlockManager.add('b5-block-box', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path class="gjs-block-svg-path" d="M2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM0 2a2 2 0 0 1 3.937-.5h8.126A2 2 0 1 1 14.5 3.937v8.126a2 2 0 1 1-2.437 2.437H3.937A2 2 0 1 1 1.5 12.063V3.937A2 2 0 0 1 0 2zm2.5 1.937v8.126c.703.18 1.256.734 1.437 1.437h8.126a2.004 2.004 0 0 1 1.437-1.437V3.937A2.004 2.004 0 0 1 12.063 2.5H3.937A2.004 2.004 0 0 1 2.5 3.937zM14 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM2 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>      
	</svg>
	<div class="gjs-block-label">Box</div>
	`,
	content: `<div class="box" ></div>
	<style> div.box {min-height: 40px;}</style>`,
	category: 'Basic',
  //attributes: { class: 'fa fa-square-o' },
});



editor.DomComponents.addType('link', {
	model: {
		defaults: {
			traits: [
			'title', 'href', 'target',  
			'data-toggle',
			{ type: 'checkbox', name: 'data-toggle' },
			'data-target',
			{ type: 'checkbox', name: 'data-target' },
			]
		}
	}
});

editor.DomComponents.addType('b5-link', {
	isComponent: el => el.tagName === 'A',
	extend: 'link',
  model: { }, // Will extend the model from 'other-defined-component'
  view: {  }, // Will extend the view from 'other-defined-component'
});


editor.BlockManager.add('b5-block-link', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
	<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
	</svg>
	</svg>
	<div class="gjs-block-label">Link</div>`,
	content: `<a data-gjs-type="b5-link" draggable="true" data-highlightable="1" id="iwrref" class="gjs-comp-selected">Link</a>`,
	category: 'Basic',
  //attributes: { class: 'fa fa-link' },
});








//HEADER
editor.BlockManager.add('b5-header', {
	label: 'Header',
	category: 'Basic',
	content: {
		type: 'header',
		content: 'Bootstrap heading'
	},
	attributes: {
		class: 'fa fa-header'
	}
});

const tm = editor.TraitManager;

    // Select trait that maps a class list to the select options.
    // The default select option is set if the input has a class, and class list is modified when select value changes.
    tm.addType('class_select', {
    	events: {
            'change': 'onChange'  // trigger parent onChange method on input change
        },
        createInput({trait}) {
        	const md = this.model;
        	const opts = md.get('options') || [];
        	const input = document.createElement('select');
        	const target_view_el = this.target.view.el;

        	for (let i = 0; i < opts.length; i++) {
        		const option = document.createElement('option');
        		let value = opts[i].value;
        		if (value === '') {
        			value = 'GJS_NO_CLASS';
                } // 'GJS_NO_CLASS' represents no class--empty string does not trigger value change
                option.text = opts[i].name;
                option.value = value;

                // Convert the Token List to an Array
                const css = Array.from(target_view_el.classList);

                const value_a = value.split(' ');
                const intersection = css.filter(x => value_a.includes(x));

                if(intersection.length === value_a.length) {
                	option.setAttribute('selected', 'selected');
                }

                input.append(option);
            }
            return input;
        },
        onUpdate({elInput, component}) {
        	const classes = component.getClasses();
        	const opts = this.model.get('options') || [];
        	for (let i = 0; i < opts.length; i++) {
        		let value = opts[i].value;
        		if (value && classes.includes(value)) {
        			elInput.value = value;
        			return;
        		}
        	}
        	elInput.value = "GJS_NO_CLASS";
        },

        onEvent({elInput, component, event}) {
        	const classes = this.model.get('options').map(opt => opt.value);
        	for (let i = 0; i < classes.length; i++) {
        		if (classes[i].length > 0) {
        			const classes_i_a = classes[i].split(' ');
        			for (let j = 0; j < classes_i_a.length; j++) {
        				if (classes_i_a[j].length > 0) {
        					component.removeClass(classes_i_a[j]);
        				}
        			}
        		}
        	}
        	const value = this.model.get('value');

            // This piece of code removes the empty attribute name from attributes list
            const elAttributes = component.attributes.attributes;
            delete elAttributes[""];

            if (value.length > 0 && value !== 'GJS_NO_CLASS') {
            	const value_a = value.split(' ');
            	for (let i = 0; i < value_a.length; i++) {
            		component.addClass(value_a[i]);
            	}
            }
            component.em.trigger('component:toggled');
        },
    });



    domc = editor.DomComponents;

    const textType = domc.getType('text');
    const textModel = textType.model;
    const textView = textType.view;

    domc.addType('header', {
    	model: textModel.extend({
    		defaults: Object.assign({}, textModel.prototype.defaults, {
    			'custom-name': 'Header',
    			tagName: 'h1',
    			traits: [
    			{
    				type: 'select',
    				options: [
    				{value: 'h1', name: 'One (largest)'},
    				{value: 'h2', name: 'Two'},
    				{value: 'h3', name: 'Three'},
    				{value: 'h4', name: 'Four'},
    				{value: 'h5', name: 'Five'},
    				{value: 'h6', name: 'Six (smallest)'},
    				],
    				label: 'Size',
    				name: 'tagName',
    				changeProp: 1
    			},
    			{
    				type: 'class_select',
    				options: [
    				{value: '', name: 'None'},
    				{value: 'display-1', name: 'One (largest)'},
    				{value: 'display-2', name: 'Two '},
    				{value: 'display-3', name: 'Three '},
    				{value: 'display-4', name: 'Four (smallest)'}
    				],
    				label: 'Display Heading'
    			}
    			].concat(textModel.prototype.defaults.traits)
    		}),

    	}, {
    		isComponent(el) {
    			if(el && ['H1','H2','H3','H4','H5','H6'].includes(el.tagName)) {
    				return {type: 'header'};
    			}
    		}
    	}),
    	view: textView
    });
    
    
    
    
//PARAGRAF       
editor.BlockManager.add('b5-paragraph', {
	label: 'Paragraph',
	category: 'Basic',
	content: {
		type: 'paragraph',
		content: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.'
	},
	attributes: {
		class: 'fa fa-paragraph'
	}
});



domc.addType('paragraph', {
	model: textModel.extend({
		defaults: Object.assign({}, textModel.prototype.defaults, {
			'custom-name': 'Paragraph',
			tagName: 'p',
			traits: [
			{
				type: 'class_select',
				options: [
				{value: '', name: 'No'},
				{value: 'lead', name: 'Yes'}
				],
				label: 'Lead?'
			}
			].concat(textModel.prototype.defaults.traits)
		})
	}, {
		isComponent(el) {
			if(el && el.tagName && el.tagName === 'P') {
				return {type: 'paragraph'};
			}
		}
	}),
	view: textView
});    







editor.BlockManager.add('b5-block-text', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M12.258 3H3.747l-.082 2.46h.478c.26-1.544.76-1.783 2.694-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
	</svg>
	<div class="gjs-block-label">Text</div>`,
	content: `<div data-gjs-type="text"  contenteditable="true" >Insert your text here</div>`,
	category: 'Basic',
  //attributes: { class: 'fa fa-font' },
});


editor.BlockManager.add('b5-image', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
	<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>  
	</svg>
	<div class="gjs-block-label">Image</div>`,
	content: {
		type: 'image',
	},
//attributes: { class: 'fa fa-file-image-o' },
category: 'Basic',
});

editor.BlockManager.add('b5-video', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
	<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
	</svg>
	<div class="gjs-block-label">Video</div>`,
	content: `<div data-gjs-type="video" draggable="true" allowfullscreen="allowfullscreen" id="iyyl" class="gjs-comp-selected"><video src="img/video2.webm" class="gjs-no-pointer" style="height: 100%; width: 100%;"></video></div>`,
  //attributes: { class: 'fa fa-file-video-o' },
  category: 'Basic',
});


editor.BlockManager.add('b5-map', {
	label: `
	<svg class="gjs-block-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
	<path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
	</svg>
	<div class="gjs-block-label">Map</div>
	`,
	content: `<iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`,
 //attributes: { class: 'fa fa-map-marker' },
 category: 'Basic',
});



editor.BlockManager.add('b5-custom-code', {
	label: `
	<svg viewBox="0 0 24 24">
	<path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path>
	</svg>
	<div class="gjs-block-label">Custom Code</div>`,
	content: {
		type: 'custom-code',
	},
//attributes: { class: 'fa fa-file-image-o' },
category: 'Basic',
});








/////////////////
//  BUTTONS
//////////////


editor.BlockManager.add('landing-block-buttons-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/1.png"/>
	<div class="my-label-block">Button 1</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	Valider
	</button>


	`,
	category: 'Buttons',
});


editor.BlockManager.add('landing-block-buttons-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/2.png"/>
	<div class="my-label-block">Button 2</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	<svg width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
	</path>
	</svg>
	Upload
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/3.png"/>
	<div class="my-label-block">Button 3</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  w-12 h-12 rounded-lg ">
	<svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
	</path>
	</svg>
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/4.png"/>
	<div class="my-label-block">Button 4</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	<svg width="20" height="20" fill="currentColor" class="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
	</path>
	</svg>
	loading
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/5.png"/>
	<div class="my-label-block">Button 5</div>
	</div>
	`,
	content: `

	<button type="button" disabled="" class="py-2 px-4  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  opacity-70 cursor-not-allowed rounded-lg ">
	Upload
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/6.png"/>
	<div class="my-label-block">Button 6</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4  bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full">
	Follow
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/7.png"/>
	<div class="my-label-block">Button 7</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full">
	<svg width="20" height="20" class="mr-2" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
	</path>
	</svg>
	Follow
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/8.png"/>
	<div class="my-label-block">Button 8</div>
	</div>
	`,
	content: `

	<button type="button" class="py-4 px-6  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full">
	Follow me
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-9', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/9.png"/>
	<div class="my-label-block">Button 9</div>
	</div>
	`,
	content: `

	<div class="flex items-center">
	<button type="button" class="w-full flex items-center border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2">
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	Star
	</button>
	<button type="button" class="w-full border text-base font-medium rounded-r-md text-black bg-white hover:bg-gray-100 px-4 py-2">
	654
	</button>
	</div>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-10', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/10.png"/>
	<div class="my-label-block">Button 10</div>
	</div>
	`,
	content: `

	<div class="flex items-center">
	<button type="button" class="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2">
	Left
	</button>
	<button type="button" class="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2">
	Center
	</button>
	<button type="button" class="w-full border-t border-b border-r text-base font-medium rounded-r-md text-black bg-white hover:bg-gray-100 px-4 py-2">
	Right
	</button>
	</div>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-11', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/11.png"/>
	<div class="my-label-block">Button 11</div>
	</div>
	`,
	content: `

	<div class="flex items-center">
	<button type="button" class="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100">
	<svg width="9" fill="currentColor" height="8" class="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z">
	</path>
	</svg>
	</button>
	<button type="button" class="w-full px-4 py-2 border-t border-b text-base text-indigo-500 bg-white hover:bg-gray-100 ">
	1
	</button>
	<button type="button" class="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">
	2
	</button>
	<button type="button" class="w-full px-4 py-2 border-t border-b text-base text-gray-600 bg-white hover:bg-gray-100">
	3
	</button>
	<button type="button" class="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">
	4
	</button>
	<button type="button" class="w-full p-4 border-t border-b border-r text-base  rounded-r-xl text-gray-600 bg-white hover:bg-gray-100">
	<svg width="9" fill="currentColor" height="8" class="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
	</path>
	</svg>
	</button>
	</div>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-12', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/12.png"/>
	<div class="my-label-block">Button 12</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	<svg width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	Sign in with Facebook
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-13', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/13.png"/>
	<div class="my-label-block">Button 13</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	<svg width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z">
	</path>
	</svg>
	Sign in with Google
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-14', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/14.png"/>
	<div class="my-label-block">Button 14</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	Sign in with GitHub
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-15', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/15.png"/>
	<div class="my-label-block">Button 15</div>
	</div>
	`,
	content: `

	<div class="flex justify-center">
	<div>
	<button type="button" class="flex mt-3 w-48 h-14 bg-black text-white rounded-xl items-center justify-center">
	<div class="mr-3">
	<svg viewBox="0 0 384 512" width="30">
	<path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z">
	</path>
	</svg>
	</div>
	<div>
	<div class="text-xs">
	Download on the
	</div>
	<div class="text-xl font-semibold font-sans -mt-1">
	App Store
	</div>
	</div>
	</button>
	<button type="button" class="flex mt-3 w-48 h-14 bg-transparent text-black border border-black rounded-xl items-center justify-center">
	<div class="mr-3">
	<svg viewBox="0 0 384 512" width="30">
	<path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z">
	</path>
	</svg>
	</div>
	<div>
	<div class="text-xs">
	Download on the
	</div>
	<div class="text-2xl font-semibold font-sans -mt-1">
	App Store
	</div>
	</div>
	</button>
	<button type="button" class="flex mt-3 w-60 h-14 bg-black text-white rounded-xl items-center justify-center">
	<div class="mr-3">
	<svg viewBox="0 0 384 512" width="30">
	<path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z">
	</path>
	</svg>
	</div>
	<div>
	<div class="text-xs">
	Download on the
	</div>
	<div class="text-2xl font-semibold font-sans -mt-1">
	Mac App Store
	</div>
	</div>
	</button>
	<button type="button" class="flex mt-3 w-48 h-14 bg-black text-white rounded-lg items-center justify-center">
	<div class="mr-3">
	<svg viewBox="30 336.7 120.9 129.2" width="30">
	<path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z">
	</path>
	<path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z">
	</path>
	<path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z">
	</path>
	<path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z">
	</path>
	</svg>
	</div>
	<div>
	<div class="text-xs">
	GET IT ON
	</div>
	<div class="text-xl font-semibold font-sans -mt-1">
	Google Play
	</div>
	</div>
	</button>
	</div>
	</div>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-16', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/16.png"/>
	<div class="my-label-block">Button 16</div>
	</div>
	`,
	content: `

	<button class=" px-6 py-2  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
	Play
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-17', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/17.png"/>
	<div class="my-label-block">Button 17</div>
	</div>
	`,
	content: `

	<button class="flex items-center px-6 py-2  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
	<svg width="20" height="20" fill="currentColor" viewBox="0 0 2304 1792" class="mr-4" xmlns="http://www.w3.org/2000/svg">
	<path d="M1728 448l-384 704h768zm-1280 0l-384 704h768zm821-192q-14 40-45.5 71.5t-71.5 45.5v1291h608q14 0 23 9t9 23v64q0 14-9 23t-23 9h-1344q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h608v-1291q-40-14-71.5-45.5t-45.5-71.5h-491q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h491q21-57 70-92.5t111-35.5 111 35.5 70 92.5h491q14 0 23 9t9 23v64q0 14-9 23t-23 9h-491zm-181 16q33 0 56.5-23.5t23.5-56.5-23.5-56.5-56.5-23.5-56.5 23.5-23.5 56.5 23.5 56.5 56.5 23.5zm1088 880q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81zm-1280 0q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81z">
	</path>
	</svg>
	Play
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-18', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/18.png"/>
	<div class="my-label-block">Button 18</div>
	</div>
	`,
	content: `

	<button class="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
	<svg width="20" height="20" fill="currentColor" viewBox="0 0 2304 1792" class="" xmlns="http://www.w3.org/2000/svg">
	<path d="M1728 448l-384 704h768zm-1280 0l-384 704h768zm821-192q-14 40-45.5 71.5t-71.5 45.5v1291h608q14 0 23 9t9 23v64q0 14-9 23t-23 9h-1344q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h608v-1291q-40-14-71.5-45.5t-45.5-71.5h-491q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h491q21-57 70-92.5t111-35.5 111 35.5 70 92.5h491q14 0 23 9t9 23v64q0 14-9 23t-23 9h-491zm-181 16q33 0 56.5-23.5t23.5-56.5-23.5-56.5-56.5-23.5-56.5 23.5-23.5 56.5 23.5 56.5 56.5 23.5zm1088 880q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81zm-1280 0q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81z">
	</path>
	</svg>
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-19', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/19.png"/>
	<div class="my-label-block">Button 19</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
	Square is me
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-20', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/20.png"/>
	<div class="my-label-block">Button 20</div>
	</div>
	`,
	content: `

	<button type="button" class="py-4 px-6  bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
	Fat is me
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-21', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/21.png"/>
	<div class="my-label-block">Button 21</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
	Justice
	<span class="p-2 ml-4">
	<svg width="20" height="20" fill="currentColor" viewBox="0 0 2304 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1728 448l-384 704h768zm-1280 0l-384 704h768zm821-192q-14 40-45.5 71.5t-71.5 45.5v1291h608q14 0 23 9t9 23v64q0 14-9 23t-23 9h-1344q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h608v-1291q-40-14-71.5-45.5t-45.5-71.5h-491q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h491q21-57 70-92.5t111-35.5 111 35.5 70 92.5h491q14 0 23 9t9 23v64q0 14-9 23t-23 9h-491zm-181 16q33 0 56.5-23.5t23.5-56.5-23.5-56.5-56.5-23.5-56.5 23.5-23.5 56.5 23.5 56.5 56.5 23.5zm1088 880q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81zm-1280 0q0 73-46.5 131t-117.5 91-144.5 49.5-139.5 16.5-139.5-16.5-144.5-49.5-117.5-91-46.5-131q0-11 35-81t92-174.5 107-195.5 102-184 56-100q18-33 56-33t56 33q4 7 56 100t102 184 107 195.5 92 174.5 35 81z">
	</path>
	</svg>
	</span>
	</button>


	`,
	category: 'Buttons',
});
editor.BlockManager.add('landing-block-buttons-22', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/22.png"/>
	<div class="my-label-block">Button 22</div>
	</div>
	`,
	content: `

	<button type="button" class="py-2 px-4  bg-gradient-to-r from-green-400 to-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
	Free space
	</button>


	`,
	category: 'Buttons',
});

editor.BlockManager.add('landing-block-buttons-23', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/buttons/23.png"/>
	<div class="my-label-block">Button 23</div>
	</div>
	`,
	content: `

	<!-- component -->
	<div class="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans py-6">
	<div class="container">
	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Filled</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-500 hover:bg-gray-600 hover:shadow-lg">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-green-500 hover:bg-green-600 hover:shadow-lg">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-red-500 hover:bg-red-600 hover:shadow-lg">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-purple-500 hover:bg-purple-600 hover:shadow-lg">Info</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-700 hover:bg-gray-900 hover:shadow-lg">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Border</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-blue-600 text-sm py-2.5 px-5 rounded-md border border-blue-600 hover:bg-blue-50">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md border border-gray-600 hover:bg-gray-50">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-md border border-green-600 hover:bg-green-50">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-red-600 text-sm py-2.5 px-5 rounded-md border border-red-600 hover:bg-red-50">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-yellow-600 text-sm py-2.5 px-5 rounded-md border border-yellow-600 hover:bg-yellow-50">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-800 text-sm py-2.5 px-5 rounded-md border border-gray-800 hover:bg-gray-200">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Flat</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-blue-600 text-sm py-2.5 px-5 rounded-md hover:bg-blue-100">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md hover:bg-gray-100">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-md hover:bg-green-100">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-red-600 text-sm py-2.5 px-5 rounded-md hover:bg-red-100">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-yellow-600 text-sm py-2.5 px-5 rounded-md hover:bg-yellow-100">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-purple-600 text-sm py-2.5 px-5 rounded-md hover:bg-purple-100">Info</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-900 text-sm py-2.5 px-5 rounded-md hover:bg-gray-200">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Disabled</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-300">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-300">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-green-300">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-red-300">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-yellow-300">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-purple-300">Info</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-400">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Gradient</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 transform hover:scale-110">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-gray-400 to-gray-600 transform hover:scale-110">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-green-400 to-green-600 transform hover:scale-110">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-red-400 to-red-600 transform hover:scale-110">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 transform hover:scale-110">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-purple-400 to-purple-600 transform hover:scale-110">Info</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gradient-to-r from-gray-600 to-gray-900 transform hover:scale-110">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Relief</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-blue-600 rounded-md bg-blue-500 hover:bg-blue-400">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-gray-600 rounded-md bg-gray-500 hover:bg-gray-400">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-green-600 rounded-md bg-green-500 hover:bg-green-400">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-red-600 rounded-md bg-red-500 hover:bg-red-400">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-yellow-600 rounded-md bg-yellow-500 hover:bg-yellow-400">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-purple-600 rounded-md bg-purple-500 hover:bg-purple-400">Info</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 border-b-4 border-gray-800 rounded-md bg-gray-700 hover:bg-gray-600">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Round</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-blue-600 text-sm py-2.5 px-5 rounded-full border border-blue-600 hover:bg-blue-50">Primary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-full border border-gray-600 hover:bg-gray-50">Secondary</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-full border border-green-600 hover:bg-green-50">Success</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-red-600 text-sm py-2.5 px-5 rounded-full border border-red-600 hover:bg-red-50">Danger</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-yellow-600 text-sm py-2.5 px-5 rounded-full border border-yellow-600 hover:bg-yellow-50">Warning</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-800 text-sm py-2.5 px-5 rounded-full border border-gray-800 hover:bg-gray-200">Dark</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Icon</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
	</svg>
	Primary
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-500 hover:bg-gray-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	Secondary
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-green-500 hover:bg-green-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
	</svg>
	Success
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-red-500 hover:bg-red-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
	</svg>
	Danger
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
	</svg>
	Warning
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-purple-500 hover:bg-purple-600 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	Info
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-700 hover:bg-gray-900 hover:shadow-lg flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
	</svg>
	Dark
	</button>
	</div>
	</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-blue-600 text-sm py-2.5 px-5 rounded-md border border-blue-600 hover:bg-blue-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
	</svg>
	Primary
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md border border-gray-600 hover:bg-gray-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	Secondary
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-md border border-green-600 hover:bg-green-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
	</svg>
	Success
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-red-600 text-sm py-2.5 px-5 rounded-md border border-red-600 hover:bg-red-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
	</svg>
	Danger
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-yellow-600 text-sm py-2.5 px-5 rounded-md border border-yellow-600 hover:bg-yellow-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
	</svg>
	Warning
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-purple-600 text-sm py-2.5 px-5 rounded-md border border-purple-600 hover:bg-purple-50 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	Info
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-gray-800 text-sm py-2.5 px-5 rounded-md border border-gray-800 hover:bg-gray-200 flex items-center">
	<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
	</svg>
	Dark
	</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Icon only</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-500 hover:bg-gray-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-green-500 hover:bg-green-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-red-500 hover:bg-red-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-purple-500 hover:bg-purple-600 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-gray-700 hover:bg-gray-900 hover:shadow-lg">
	<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
	</svg>
	</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Group</div>
	<div class="w-full py-3">
	<div class="flex inline-flex mr-2" role="group">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-blue-500 rounded-l-md hover:bg-blue-600 hover:shadow-lg">Left</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Middle</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-blue-500 rounded-r-md hover:bg-blue-600 hover:shadow-lg">Right</button>
	</div>

	<div class="flex inline-flex mr-2" role="group">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-green-500 rounded-l-md hover:bg-green-600 hover:shadow-lg">Left</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-green-500 hover:bg-green-600 hover:shadow-lg">Middle</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-green-500 rounded-r-md hover:bg-green-600 hover:shadow-lg">Right</button>
	</div>

	<div class="flex inline-flex mr-2" role="group">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-purple-500 rounded-l-md hover:bg-purple-600 hover:shadow-lg">Left</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-purple-500 hover:bg-purple-600 hover:shadow-lg">Middle</button>
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-purple-500 rounded-r-md hover:bg-purple-600 hover:shadow-lg">Right</button>
	</div>
	</div>
	</div>

	<div class="card bg-white py-3 px-5 rounded-xl flex flex-col mb-5">
	<div class="title text-xl font-medium">Sizes</div>
	<div class="w-full py-3">
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-md py-3 px-6 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Large</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Default</button>
	</div>
	<div class="inline-block mr-2 mt-2">
	<button type="button" class="focus:outline-none text-white text-xs py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Small</button>
	</div>
	</div>
	</div>

	</div>
	</div>


	`,
	category: 'Buttons',
});












































/////////////////
//  Navigation
//////////////





editor.BlockManager.add('landing-block-navigation-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/1.png"/>
	<div class="my-label-block">Navigation 1</div>
	</div>
	`,
	content: `

	<div class="text-gray-700 bg-white body-font">
	<div class="flex flex-col flex-wrap p-5 mx-auto border-b md:items-center md:flex-row">
	<a href="./index.html" class="pr-2 lg:pr-8 lg:px-6 focus:outline-none">
	<div class="inline-flex items-center">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="font-semibold tracking-tighter transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
	Wicked Blocks
	</h2>
	</div>
	</a>
	<nav class="flex flex-wrap items-center justify-center text-base md:ml-auto md:mr-auto">
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Pricing</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Contact</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Services</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Now</a>
	</nav>
	<button
	class="items-center px-8 py-2 ml-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-blueGray-900 focus:ring focus:outline-none">Button
	</button>
	</div>
	</div>
	<div class="container w-full p-20 m-4 mx-auto my-16 text-center bg-white border-2 border-dashed border-blueGray-300 h-96 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	--  Content goes here --
	</p>
	</div>

	`,
	category: 'Navigation',
});
editor.BlockManager.add('landing-block-navigation-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/2.png"/>
	<div class="my-label-block">Navigation 2</div>
	</div>
	`,
	content: `
	<div class="text-gray-700 bg-white border-t border-b body-font">
	<div class="flex flex-col flex-wrap p-5 mx-auto md:items-center md:flex-row">
	<a href="./index.html" class="pr-2 lg:pr-8 lg:px-6 focus:outline-none">
	<div class="inline-flex items-center">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="font-semibold tracking-tighter transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
	Wicked Blocks
	</h2>
	</div>
	</a>
	<nav class="flex flex-wrap items-center justify-center text-base ">
	<a href="#"
	class="mr-5 text-sm font-semibold text-gray-600 lg:ml-24 hover:text-gray-800">Pricing</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Contact</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Services</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Now</a>
	</nav>
	<div class="flex ml-auto">
	<button
	class="items-center px-8 py-2 ml-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-blueGray-900 focus:ring focus:outline-none">Button</button>
	<button
	class="items-center px-8 py-2 mt-4 ml-5 font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg lg:inline-flex lg:mt-px hover:border-black0 hover:bg-black hover:text-white focus:ring focus:outline-none">Button
	<svg class="hidden lg:block" fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</div>
	</div>
	<div
	class="container w-full p-20 m-4 mx-auto my-16 text-center bg-white border-2 border-dashed border-blueGray-300 h-96 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	-- Content goes here --
	</p>
	</div>

	`,
	category: 'Navigation',
});

editor.BlockManager.add('landing-block-navigation-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/3.png"/>
	<div class="my-label-block">Navigation 3</div>
	</div>
	`,
	content: `
	<div class="text-gray-700 bg-white body-font">
	<div class="flex flex-col flex-wrap p-5 mx-auto border-b md:items-center md:flex-row">
	<a href="./index.html" class="pr-2 lg:pr-8 lg:px-6 focus:outline-none">
	<div class="inline-flex items-center">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="font-semibold tracking-tighter transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
	Wicked Blocks
	</h2>
	</div>
	</a>
	<nav class="flex flex-wrap items-center justify-center text-base md:ml-auto ">
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Pricing</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Contact</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Services</a>
	<a href="#" class="mr-5 text-sm font-semibold text-gray-600 hover:text-gray-800">Now</a>
	</nav>
	<button
	class="items-center px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-blueGray-900 focus:ring focus:outline-none">Button

	</button>
	</div>
	</div>
	<div
	class="container w-full p-20 m-4 mx-auto my-16 text-center bg-white border-2 border-dashed border-blueGray-300 h-96 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	-- Content goes here --
	</p>
	</div>

	`,
	category: 'Navigation',
});




editor.BlockManager.add('landing-block-navigation-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/4.png"/>
	<div class="my-label-block">Navigation 4</div>
	</div>
	`,
	content: `
	<header class="text-gray-600 body-font">
	<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
	<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
	<a class="mr-5 hover:text-gray-900">First Link</a>
	<a class="mr-5 hover:text-gray-900">Second Link</a>
	<a class="mr-5 hover:text-gray-900">Third Link</a>
	<a class="mr-5 hover:text-gray-900">Fourth Link</a>
	</nav>
	<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</header>

	`,
	category: 'Navigation',
});


editor.BlockManager.add('landing-block-navigation-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/5.png"/>
	<div class="my-label-block">Navigation 5</div>
	</div>
	`,
	content: `
	<header class="text-gray-600 body-font">
	<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
	<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
	<a class="mr-5 hover:text-gray-900">First Link</a>
	<a class="mr-5 hover:text-gray-900">Second Link</a>
	<a class="mr-5 hover:text-gray-900">Third Link</a>
	<a class="mr-5 hover:text-gray-900">Fourth Link</a>
	</nav>
	<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</header>

	`,
	category: 'Navigation',
});



editor.BlockManager.add('landing-block-navigation-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/6.png"/>
	<div class="my-label-block">Navigation 6</div>
	</div>
	`,
	content: `
	<header class="text-gray-600 body-font">
	<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
	<nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
	<a class="mr-5 hover:text-gray-900">First Link</a>
	<a class="mr-5 hover:text-gray-900">Second Link</a>
	<a class="mr-5 hover:text-gray-900">Third Link</a>
	<a class="hover:text-gray-900">Fourth Link</a>
	</nav>
	<a class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
	<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</div>
	</header>

	`,
	category: 'Navigation',
});



editor.BlockManager.add('landing-block-navigation-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/navigation/7.png"/>
	<div class="my-label-block">Navigation 7</div>
	</div>
	`,
	content: `
	<header class="text-gray-600 body-font">
	<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
	<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
	<a class="mr-5 hover:text-gray-900">First Link</a>
	<a class="mr-5 hover:text-gray-900">Second Link</a>
	<a class="mr-5 hover:text-gray-900">Third Link</a>
	<a class="mr-5 hover:text-gray-900">Fourth Link</a>
	</nav>
	<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</header>

	`,
	category: 'Navigation',
});










//LEFT HEADERS

editor.BlockManager.add('landing-block-head-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/1.jpg"/>
	<div class="my-label-block">Left Header 1</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto md:flex-row">
	<div
	class="flex flex-col items-center w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 xl:mr-20 md:pr-24 md:items-start md:text-left md:mb-0 lg:text-center">
	<h2 class="mb-1 text-xs font-medium tracking-widest text-black title-font">
	Your tagline
	</h2>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Medium length display headline.
	</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">
	Deploy
	your mvp in
	minutes, not days. WT offers you a a wide selection swapable sections for your landing page.
	</p>
	<div class="flex justify-center">
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	<p class="mt-2 text-sm text-center text-gray-600 md:ml-6 md:mt-0 sm:text-left">
	It will take you to candy shop.
	<br class="hidden lg:block">
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</p>
	</div>
	</div>
	<div class="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
	<img class="object-cover object-center rounded-lg " alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	</div>
	</section>



	`,
	category: 'Left Headers',

});




editor.BlockManager.add('landing-block-head-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/2.jpg"/>
	<div class="my-label-block">Left Header 2</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="flex flex-col items-center w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0 lg:text-center">
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Medium length display headline.
	</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">
	Deploy your mvp in minutes, not days. WT offers you a a wide selection swapable sections for
	your landing page.
	</p>
	<div class="flex justify-center">
	<flex-grow w-full px-4 py-2 mb-4 mr-4 text-base text-black transition duration-1000 ease-in-out transform rounded-lg
	bg-blueGray-200 focus:outline-none focus:border-purple-500 sm:mb-0 focus:bg-white focus:shadow-outline focus:ring-2
	ring-offset-current ring-offset-2"
	placeholder="Your Email"
	type="email">
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	<p class="w-full mt-2 mb-8 text-sm text-left text-gray-600">
	I got 99 problems and blocks ain't one.
	</p>
	</div>
	<div class="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
	<img class="object-cover object-center rounded-lg "
	alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	</div>
	</section>



	`,
	category: 'Left Headers',
});


editor.BlockManager.add('landing-block-head-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/3.jpg"/>
	<div class="my-label-block">Left Header 3</div>
	</div>
	`,
	content: `



	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="flex flex-col items-center w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0 lg:text-center">
	<h2 class="mb-1 text-xs font-medium tracking-widest text-black title-font">Your tagline</h2>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Longer medium lenght display headline to convert.
	</h1>
	<div class="flex flex-wrap -mx-4 -mt-4 -mb-10 sm:-m-4 ">
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8                           5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">
	Information 1
	</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.
	</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">
	Information 1</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	<div class="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
	<img class="object-cover object-center rounded-lg " alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	</div>
	</section>



	`,
	category: 'Left Headers',
});





editor.BlockManager.add('landing-block-head-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/4.jpg"/>
	<div class="my-label-block">Left Header 4</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div
	class="flex flex-col items-center w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 lg:mr-20 md:items-start md:text-left md:mb-0 lg:text-center">
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-2xl title-font">
	A pretty long lenght display headline ready to convert visitors into users.
	</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">
	Deploy
	your mvp in
	minutes, not days. WT offers you a a wide selection swapable sections for your landing page.You
	are going to have
	fun building it, I did.
	</p>
	<p class="flex items-center mb-2 text-gray-600"><span
	class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
	</svg>
	</span>
	Vexillologist pitchfork
	</p>
	<p class="flex items-center mb-2 text-gray-600">
	<span class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
	</svg>
	</span>
	Tumeric plaid portland
	</p>
	<p class="flex items-center mb-6 text-gray-600">
	<span class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
	</svg>
	</span>
	Mixtape chillwave tumeric
	</p>
	</div>
	<div class="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
	<img class="object-cover object-center rounded-lg " alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	</div>
	</section>



	`,
	category: 'Left Headers',
});


editor.BlockManager.add('landing-block-head-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/5.jpg"/>
	<div class="my-label-block">Left Header 5</div>
	</div>
	`,
	content: `


	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="flex flex-col items-center w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0 lg:text-center">
	<div class="flex flex-wrap -mx-4 -mt-4 -mb-10 sm:-m-4 ">
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">
	Information 1
	</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.
	</p>
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">
	Information 2
	</h2>
	<p class="text-base leading-relaxed">
	Explain 2 great feature here. Information about the
	feature.
	</p>
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 3</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.
	</p>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">
	Information 4
	</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.
	</p>
	</div>
	</div>
	</div>
	</div>
	<div class="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
	<img class="object-cover object-center rounded-lg " alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	</div>
	</section>



	`,
	category: 'Left Headers',
});


editor.BlockManager.add('landing-block-head-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/left-header/6.jpg"/>
	<div class="my-label-block">Left Header 6</div>
	</div>
	`,
	content: `


	<section class="flex flex-col items-center h-screen md:flex-row ">
	<div class="hidden w-full h-screen bg-gray-200 bg-left-bottom bg-cover lg:block md:w-1/3 xl:w-1/3">
	<img src="https://dummyimage.com/600x1024/F3F4F7/8693ac" alt="" class="object-cover w-full h-full ">
	</div>
	<div class="flex w-full h-screen px-6 bg-white md:max-w-md lg:max-w-full md:w-1/2 xl:w-1/2 lg:px-16 xl:px-12 items-left justify-left">
	<div class="w-full h-100">
	<a class="inline-flex items-center w-48 mt-32 mb-20 font-medium text-gray-900 title-font md:mb-16 md:mt-32">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="font-semibold tracking-tighter transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
	Wicked Blocks
	</h2>
	</a>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Medium length display headline.
	</h1>
	<p class="mb-8 text-base leading-relaxed text-left text-gray-900 lg:text-1xl">
	Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal use.
	</p>
	<div class="flex">
	<button class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	<p class="mt-2 text-sm text-center text-gray-600 md:ml-6 md:mt-0 sm:text-left">
	It will take you to candy shop.
	<br class="hidden lg:block">
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="20" height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</p>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Left Headers',
});

























//////////////////////////////////////////////
//CENTER HEADERS
///////////////////////////////////////////////

editor.BlockManager.add('landing-block-center-head-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/center-header/1.jpg"/>
	<div class="my-label-block">Center Header 1</div>
	</div>
	`,
	content: `


	<section class="text-gray-700 body-font">
	<div class="container px-8 py-48 mx-auto lg:px-4">
	<div class="flex flex-col w-full mb-12 text-left lg:text-center">
	<h2 class="mb-1 text-xs font-semibold tracking-widest text-blue-600 uppercase title-font">a great
	header right here</h2>
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-5xl title-font">
	A centered
	<br class="md:hidden">
	medium length display headline.
	</h1>
	<p class="mx-auto text-base font-medium leading-relaxed text-gray-700 lg:w-2/3">You're about to launch soon and must be 100% focused on your product. Don't loose precious days designing, coding the landing page and testing a site. Instead, integrate one with your favourite framework.

	.</p>
	</div>
	<div class="flex lg:justify-center">
	<button
	class="inline-flex px-6 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	<button
	class="inline-flex items-center px-6 py-2 ml-4 font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg shadow-xl hover:border-gray-600 hover:bg-gray-600 hover:text-white focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</section>


	`,
	category: 'Center Headers',
});

editor.BlockManager.add('landing-block-center-head-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/center-header/2.jpg"/>
	<div class="my-label-block">Center Header 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto pt-36 lg:px-4">
	<div class="flex flex-col w-full mx-auto mb-12 text-left lg:w-2/3 lg:text-center">
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-5xl title-font">
	A  medium length display headline.
	</h1>
	<p class="mx-auto text-base font-medium leading-relaxed text-gray-700 lg:w-2/3">You're about to launch soon and must be 100% focused on your product. Don't loose precious days designing, coding the landing page and testing a site. Instead, integrate one with your favourite framework.

	.</p>
	</div>
	<div class="flex flex-col w-full px-0 mx-auto lg:w-2/3 sm:flex-row md:px-8">
	<input
	class="flex-grow w-full px-4 py-2 mb-4 mr-4 text-base text-black transition duration-1000 ease-in-out transform rounded-lg bg-blueGray-200 focus:outline-none focus:border-purple-500 sm:mb-0 focus:bg-white focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
	placeholder="Your Name" type="text">
	<input
	class="flex-grow w-full px-4 py-2 mb-4 mr-4 text-base text-black transition duration-1000 ease-in-out transform rounded-lg bg-blueGray-200 focus:outline-none focus:border-purple-500 sm:mb-0 focus:bg-white focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
	placeholder="Your Email" type="email">
	<button
	class="w-1/2 px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Sign
	Up</button>
	</div>
	<p class="w-full mt-12 mb-8 text-sm text-center text-gray-500">Neutra shabby chic ramps, viral
	fixie.<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a></p>
	</section>
	`,
	category: 'Center Headers',
});

editor.BlockManager.add('landing-block-center-head-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/center-header/3.jpg"/>
	<div class="my-label-block">Center Header 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto pt-36 lg:px-4">
	<div class="flex flex-col w-full mb-12 text-left lg:text-center">
	<h2 class="mb-1 text-xs font-semibold tracking-widest text-blue-600 uppercase title-font">a great
	header right here</h2>
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-6xl title-font">
	A Long headline
	<br class="">
	to convey your users.
	</h1>
	<p class="mx-auto text-base font-medium leading-relaxed text-gray-700 lg:w-2/3">Whatever cardigan
	tote bag tumblr hexagon brooklyn
	asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of
	them man
	bun deep.</p>
	<div class="flex items-end justify-center w-full mx-auto mt-12 lg:w-1/2">
	<div class="relative w-2/4 mr-4 text-left lg:w-full xl:w-1/2 md:w-full">
	<input type="text" id="hero-field" name="hero-field"
	class="flex-grow w-full px-4 py-2 mb-4 mr-4 text-base text-black transition duration-1000 ease-in-out transform rounded-lg bg-blueGray-200 focus:outline-none focus:border-purple-500 sm:mb-0 focus:bg-white focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	</div>
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Action</button>
	</div>
	<p class="w-1/3 mx-auto mt-6 mb-8 text-sm text-gray-600 ">It enables developers to host Jamstack websites and web
	services that deploy instantly.</p>
	</div>
	</section>


	`,
	category: 'Center Headers',
});

editor.BlockManager.add('landing-block-center-head-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/center-header/4.jpg"/>
	<div class="my-label-block">Center Header 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto py-36 lg:px-4">
	<div class="flex flex-col w-full mb-12 text-left lg:text-center">
	<h2 class="mb-1 text-xs font-semibold tracking-widest text-blue-600 uppercase title-font">a great
	header right here</h2>
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-6xl title-font">
	A Long headline
	<br class="">
	to convey your users.
	</h1>
	<p class="mx-auto text-base font-medium leading-relaxed text-gray-700 lg:w-1/2">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal use.You're about to launch soon and must be 100% focused on your product. Don't loose precious days designing, coding the landing page and testing a site. Instead, integrate one with your favourite framework.

	. </p>
	</div>
	</section>



	`,
	category: 'Center Headers',
});

editor.BlockManager.add('landing-block-center-head-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/center-header/5.jpg"/>
	<div class="my-label-block">Center Header 5</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto pt-36 lg:px-4">
	<div class="flex flex-col w-full mb-12 text-left lg:text-center">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mx-auto mb-5 text-black bg-gray-200 rounded-full">
	<svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="24"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M5.68 7.314l-1.82 5.914L12 19.442l8.14-6.214-1.82-5.914L16.643 11H7.356L5.681 7.314zM15.357 9l2.888-6.354a.4.4 0 0 1 .747.048l3.367 10.945a.5.5 0 0 1-.174.544L12 21.958 1.816 14.183a.5.5 0 0 1-.174-.544L5.009 2.694a.4.4 0 0 1 .747-.048L8.644 9h6.712z" />
	</svg>
	</div>
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-6xl title-font">
	A Long headline
	<br class="">
	to convey your users.
	</h1>
	<p class="mx-auto text-base font-medium leading-relaxed text-gray-700 lg:w-1/2">Tailwind CSS
	templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.You're about to launch soon and must be 100% focused on your product. Don't loose precious days designing, coding the landing page and testing a site. Instead, integrate one with your favourite framework.

	. </p>
	</div>
	</section>


	`,
	category: 'Center Headers',
});















////////////////////////////////////////////
// RIGHT HEADERS
////////////////////////////////////////////



editor.BlockManager.add('landing-block-right-head-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/1.jpg"/>
	<div class="my-label-block">Right Header 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<h2 class="mb-1 text-xs font-medium tracking-widest text-black title-font">Your tagline</h2>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Medium length display headline.</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">Deploy
	your mvp in
	minutes, not days. WT offers you a a wide selection swapable sections for your landing page.</p>
	<div class="flex justify-center">
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	<p class="mt-2 text-sm text-center text-gray-600 md:ml-6 md:mt-0 sm:text-left">Great things can happend
	<br class="hidden lg:block">
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" /></svg>
	</a>
	</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Right Headers',
});

editor.BlockManager.add('landing-block-right-head-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/2.jpg"/>
	<div class="my-label-block">Right Header 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Medium length display headline.</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">Deploy
	your mvp in
	minutes, not days. WT offers you a a wide selection swapable sections for your landing page.</p>
	<div class="flex justify-center">
	<input
	class="flex-grow w-full px-4 py-2 mb-4 mr-4 text-base text-black transition duration-1000 ease-in-out transform rounded-lg bg-blueGray-200 focus:outline-none focus:border-purple-500 sm:mb-0 focus:bg-white focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
	placeholder="Your Email" type="email">
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	<p class="w-full mt-2 mb-8 text-sm text-left text-gray-600">Peanut butter jelly time, yeah.</p>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Right Headers',
});

editor.BlockManager.add('landing-block-right-head-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/3.jpg"/>
	<div class="my-label-block">Right Header 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<h2 class="mb-1 text-xs font-medium tracking-widest text-black title-font">Your tagline</h2>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-5xl title-font">
	Longer medium length display headline to convert.</h1>
	<div class="flex flex-wrap -mx-4 -mt-4 -mb-10 sm:-m-4 ">
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 1</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the feature.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 1</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the feature.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Right Headers',
});

editor.BlockManager.add('landing-block-right-head-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/4.jpg"/>
	<div class="my-label-block">Right Header 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<h1 class="mb-8 text-2xl font-bold tracking-tighter text-center text-black lg:text-left lg:text-2xl title-font">
	A pretty long length display headline ready to convert visitors into users.</h1>
	<p class="mb-8 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-1xl">Deploy
	your mvp in
	minutes, not days. WT offers you a a wide selection swapable sections for your landing page.You
	are going to have
	fun building it, I did..</p>
	<p class="flex items-center mb-2 text-gray-600"><span
	class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" /></svg>
	</span>Super Hyper Mega Feature</p>
	<p class="flex items-center mb-2 text-gray-600"><span
	class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
	</svg></span>Thumbs upp baby</p>
	<p class="flex items-center mb-6 text-gray-600"><span
	class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full">
	<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
	</svg></span>This feature is useless</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Right Headers',
});

editor.BlockManager.add('landing-block-right-head-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/5.jpg"/>
	<div class="my-label-block">Right Header 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-24 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero"
	src="https://dummyimage.com/720x600/F3F4F7/8693ac">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<div class="flex flex-wrap -mx-4 -mt-4 -mb-10 sm:-m-4 ">
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 1</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 2</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 3</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.</p>
	</div>
	</div>
	<div class="flex flex-col items-center p-4 mb-6 text-center md:w-1/2 md:mb-0 lg:text-left lg:items-start">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="mb-3 text-lg font-medium tracking-tighter text-gray-700 title-font">Information 4</h2>
	<p class="text-base leading-relaxed">Explain 2 great feature here. Information about the
	feature.</p>
	</div>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Right Headers',
});

editor.BlockManager.add('landing-block-right-head-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/right-header/6.jpg"/>
	<div class="my-label-block">Right Header 6</div>
	</div>
	`,
	content: `
	<section class="flex flex-wrap items-center h-screen md">
	<div class="container w-full h-screen bg-white md:w-1/2">
	<div class="mx-5 lg:mx-32 ">
	<a class="flex items-center w-48 mt-32 mb-4 font-medium text-gray-900 title-font md:mb-0 lg:mt-16">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="font-semibold tracking-tighter uppercase transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
	Wickedblocks
	</h2>
	</a>
	<div class="flex mt-16 font-light text-gray-500">
	<div class="pr-4">
	<h1 class="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-6xl title-font">
	Short Header.
	</h1>
	</div>
	</div>
	<div class="w-full mt-16 text-base font-medium text-gray-700 sm:md:w-3/3 mb-8leading-relaxed">
	All you have to do is choose the section you need, remove the one that you do not need for that
	project and paste the one you need in that moment. All the section have been given the same
	left/right padding. Because consistence is king. (Bullshit)
	</div>
	<div class="flex mt-12">
	<button
	class="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>

	</div>
	</div>
	</div>
	<div class="hidden w-full h-screen bg-center bg-cover md:w-1/2 lg:block">
	<!----Image will be full height/width-->
	<img src="https://dummyimage.com/1000x1000/F3F4F7/8693ac" class="object-fill w-full h-screen" alt="" />
	</div>

	</section>

	`,
	category: 'Right Headers',
});
















//////////////////////////////
//  CONTENT
/////////////////////////////

editor.BlockManager.add('landing-block-content-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/1.png"/>
	<div class="my-label-block">Content 1</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
	</div>
	<div class="flex flex-wrap">
	<div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
	<h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
	<p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
	<h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">The Catalyzer</h2>
	<p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
	<h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Neptune</h2>
	<p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
	<h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Melanchole</h2>
	<p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});


editor.BlockManager.add('landing-block-content-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/2.png"/>
	<div class="my-label-block">Content 2</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap w-full mb-20">
	<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
	<div class="h-1 w-20 bg-indigo-500 rounded"></div>
	</div>
	<p class="lg:w-1/2 w-full leading-relaxed text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="xl:w-1/4 md:w-1/2 p-4">
	<div class="bg-gray-100 p-6 rounded-lg">
	<img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/720x400" alt="content">
	<h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-4">Chichen Itza</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	<div class="xl:w-1/4 md:w-1/2 p-4">
	<div class="bg-gray-100 p-6 rounded-lg">
	<img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/721x401" alt="content">
	<h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-4">Colosseum Roma</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	<div class="xl:w-1/4 md:w-1/2 p-4">
	<div class="bg-gray-100 p-6 rounded-lg">
	<img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/722x402" alt="content">
	<h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-4">Great Pyramid of Giza</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	<div class="xl:w-1/4 md:w-1/2 p-4">
	<div class="bg-gray-100 p-6 rounded-lg">
	<img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/723x403" alt="content">
	<h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-4">San Francisco</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	</div>
	</div>
	</section>	

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/3.png"/>
	<div class="my-label-block">Content 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
	<p class="lg:w-1/2 w-full leading-relaxed text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">Neptune</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">Melanchole</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">Bunker</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg">
	<div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>
	</div>
	<h2 class="text-lg text-gray-900 font-medium title-font mb-2">Ramona Falls</h2>
	<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
	</div>
	</div>
	</div>
	<button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/4.png"/>
	<div class="my-label-block">Content 4</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container flex flex-wrap px-5 py-24 mx-auto items-center">
	<div class="md:w-1/2 md:pr-12 md:py-8 md:border-r md:border-b-0 mb-10 md:mb-0 pb-10 border-b border-gray-200">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
	<p class="leading-relaxed text-base">Locavore cardigan small batch roof party blue bottle blog meggings sartorial jean shorts kickstarter migas sriracha church-key synth succulents. Actually taiyaki neutra, distillery gastropub pok pok ugh.</p>
	<a class="text-indigo-500 inline-flex items-center mt-4">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="flex flex-col md:w-1/2 md:pl-12">
	<h2 class="title-font font-semibold text-gray-800 tracking-wider text-sm mb-3">CATEGORIES</h2>
	<nav class="flex flex-wrap list-none -mb-1">
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Fifth Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Sixth Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Seventh Link</a>
	</li>
	<li class="lg:w-1/3 mb-1 w-1/2">
	<a class="text-gray-600 hover:text-gray-800">Eighth Link</a>
	</li>
	</nav>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/5.png"/>
	<div class="my-label-block">Content 5</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<h2 class="sm:text-3xl text-2xl text-gray-900 font-medium title-font mb-2 md:w-2/5">Kickstarter Actually Pinterest Brunch Bitters Occupy</h2>
	<div class="md:w-3/5 md:pl-6">
	<p class="leading-relaxed text-base">Taxidermy bushwick celiac master cleanse microdosing seitan. Fashion axe four dollar toast truffaut, direct trade kombucha brunch williamsburg keffiyeh gastropub tousled squid meh taiyaki drinking vinegar tacos.</p>
	<div class="flex md:mt-4 mt-6">
	<button class="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	<a class="text-indigo-500 inline-flex items-center ml-4">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/6.png"/>
	<div class="my-label-block">Content 6</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-col">
	<div class="lg:w-4/6 mx-auto">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1200x500">
	</div>
	<div class="flex flex-col sm:flex-row mt-10">
	<div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
	<div class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex flex-col items-center text-center justify-center">
	<h2 class="font-medium title-font mt-4 text-gray-900 text-lg">Phoebe Caulfield</h2>
	<div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
	<p class="text-base">Raclette knausgaard hella meggs normcore williamsburg enamel pin sartorial venmo tbh hot chicken gentrify portland.</p>
	</div>
	</div>
	<div class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
	<p class="leading-relaxed text-lg mb-4">Meggings portland fingerstache lyft, post-ironic fixie man bun banh mi umami everyday carry hexagon locavore direct trade art party. Locavore small batch listicle gastropub farm-to-table lumbersexual salvia messenger bag. Coloring book flannel truffaut craft beer drinking vinegar sartorial, disrupt fashion axe normcore meh butcher. Portland 90's scenester vexillologist forage post-ironic asymmetrical, chartreuse disrupt butcher paleo intelligentsia pabst before they sold out four loko. 3 wolf moon brooklyn.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/7.png"/>
	<div class="my-label-block">Content 7</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -mx-4 -mb-10 text-center">
	<div class="sm:w-1/2 mb-10 px-4">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1201x501">
	</div>
	<h2 class="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Buy YouTube Videos</h2>
	<p class="leading-relaxed text-base">Williamsburg occupy sustainable snackwave gochujang. Pinterest cornhole brunch, slow-carb neutra irony.</p>
	<button class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	</div>
	<div class="sm:w-1/2 mb-10 px-4">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1202x502">
	</div>
	<h2 class="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Williamsburg occupy sustainable snackwave gochujang. Pinterest cornhole brunch, slow-carb neutra irony.</p>
	<button class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/8.png"/>
	<div class="my-label-block">Content 8</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col">
	<div class="h-1 bg-gray-200 rounded overflow-hidden">
	<div class="w-24 h-full bg-indigo-500"></div>
	</div>
	<div class="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
	<h1 class="sm:w-2/5 text-gray-900 font-medium title-font text-2xl mb-2 sm:mb-0">Space The Final Frontier</h1>
	<p class="sm:w-3/5 leading-relaxed text-base sm:pl-10 pl-0">Street art subway tile salvia four dollar toast bitters selfies quinoa yuccie synth meditation iPhone intelligentsia prism tofu. Viral gochujang bitters dreamcatcher.</p>
	</div>
	</div>
	<div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
	<div class="p-4 md:w-1/3 sm:mb-0 mb-6">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1203x503">
	</div>
	<h2 class="text-xl font-medium title-font text-gray-900 mt-5">Shooting Stars</h2>
	<p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
	<a class="text-indigo-500 inline-flex items-center mt-3">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="p-4 md:w-1/3 sm:mb-0 mb-6">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1204x504">
	</div>
	<h2 class="text-xl font-medium title-font text-gray-900 mt-5">The Catalyzer</h2>
	<p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
	<a class="text-indigo-500 inline-flex items-center mt-3">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="p-4 md:w-1/3 sm:mb-0 mb-6">
	<div class="rounded-lg h-64 overflow-hidden">
	<img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1205x505">
	</div>
	<h2 class="text-xl font-medium title-font text-gray-900 mt-5">The 400 Blows</h2>
	<p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
	<a class="text-indigo-500 inline-flex items-center mt-3">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});






editor.BlockManager.add('landing-block-content-9', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/9.png"/>
	<div class="my-label-block">Content 9</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
	<h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Slow-carb next level shoindxgoitch ethical authentic, scenester sriracha forage.</h1>
	<button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">Button</button>
	</div>
	</div>
	</section>	

	`,
	category: 'Content',
});


editor.BlockManager.add('landing-block-content-10', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/10.png"/>
	<div class="my-label-block">Content 10</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
	<div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
	<h1 class="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical authentic, poko scenester</h1>
	<p class="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
	</div>
	<div class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
	<h2 class="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
	<div class="relative mb-4">
	<label for="full-name" class="leading-7 text-sm text-gray-600">Full Name</label>
	<input type="text" id="full-name" name="full-name" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<div class="relative mb-4">
	<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
	<input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-11', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/11.png"/>
	<div class="my-label-block">Content 11</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-12">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep.</p>
	</div>
	<div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
	<div class="relative flex-grow w-full">
	<label for="full-name" class="leading-7 text-sm text-gray-600">Full Name</label>
	<input type="text" id="full-name" name="full-name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<div class="relative flex-grow w-full">
	<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
	<input type="email" id="email" name="email" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-12', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/12.png"/>
	<div class="my-label-block">Content 12</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex items-center md:flex-row flex-col">
	<div class="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
	<h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
	<h1 class="md:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
	</div>
	<div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
	<path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">GET IT ON</span>
	<span class="title-font font-medium">Google Play</span>
	</span>
	</button>
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
	<path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
	<path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">Download on the</span>
	<span class="title-font font-medium">App Store</span>
	</span>
	</button>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});





editor.BlockManager.add('landing-block-content-13', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/13.png"/>
	<div class="my-label-block">Content 13</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4">
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/420x260">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">The Catalyzer</h2>
	<p class="mt-1">$16.00</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/421x261">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">Shooting Stars</h2>
	<p class="mt-1">$21.15</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/422x262">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">Neptune</h2>
	<p class="mt-1">$12.00</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/423x263">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">The 400 Blows</h2>
	<p class="mt-1">$18.40</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/424x264">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">The Catalyzer</h2>
	<p class="mt-1">$16.00</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/425x265">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">Shooting Stars</h2>
	<p class="mt-1">$21.15</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/427x267">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">Neptune</h2>
	<p class="mt-1">$12.00</p>
	</div>
	</div>
	<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
	<a class="block relative h-48 rounded overflow-hidden">
	<img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/428x268">
	</a>
	<div class="mt-4">
	<h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
	<h2 class="text-gray-900 title-font text-lg font-medium">The 400 Blows</h2>
	<p class="mt-1">$18.40</p>
	</div>
	</div>
	</div>
	</div>
	</section>
	

	`,
	category: 'Content',
});


editor.BlockManager.add('landing-block-content-14', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/14.png"/>
	<div class="my-label-block">Content 14</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font overflow-hidden">
	<div class="container px-5 py-24 mx-auto">
	<div class="lg:w-4/5 mx-auto flex flex-wrap">
	<img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400">
	<div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
	<h2 class="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
	<h1 class="text-gray-900 text-3xl title-font font-medium mb-1">The Catcher in the Rye</h1>
	<div class="flex mb-4">
	<span class="flex items-center">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
	<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
	</svg>
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
	<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
	</svg>
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
	<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
	</svg>
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
	<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
	</svg>
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
	<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
	</svg>
	<span class="text-gray-600 ml-3">4 Reviews</span>
	</span>
	<span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	<p class="leading-relaxed">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
	<div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
	<div class="flex">
	<span class="mr-3">Color</span>
	<button class="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
	<button class="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
	<button class="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
	</div>
	<div class="flex ml-6 items-center">
	<span class="mr-3">Size</span>
	<div class="relative">
	<select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
	<option>SM</option>
	<option>M</option>
	<option>L</option>
	<option>XL</option>
	</select>
	<span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
	<path d="M6 9l6 6 6-6"></path>
	</svg>
	</span>
	</div>
	</div>
	</div>
	<div class="flex">
	<span class="title-font font-medium text-2xl text-gray-900">$58.00</span>
	<button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	<button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
	</svg>
	</button>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-15', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/15.png"/>
	<div class="my-label-block">Content 15</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font overflow-hidden">
	<div class="container px-5 py-24 mx-auto">
	<div class="lg:w-4/5 mx-auto flex flex-wrap">
	<div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
	<h2 class="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
	<h1 class="text-gray-900 text-3xl title-font font-medium mb-4">Animated Night Hill Illustrations</h1>
	<div class="flex mb-4">
	<a class="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">Description</a>
	<a class="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">Reviews</a>
	<a class="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">Details</a>
	</div>
	<p class="leading-relaxed mb-4">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam inxigo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean.</p>
	<div class="flex border-t border-gray-200 py-2">
	<span class="text-gray-500">Color</span>
	<span class="ml-auto text-gray-900">Blue</span>
	</div>
	<div class="flex border-t border-gray-200 py-2">
	<span class="text-gray-500">Size</span>
	<span class="ml-auto text-gray-900">Medium</span>
	</div>
	<div class="flex border-t border-b mb-6 border-gray-200 py-2">
	<span class="text-gray-500">Quantity</span>
	<span class="ml-auto text-gray-900">4</span>
	</div>
	<div class="flex">
	<span class="title-font font-medium text-2xl text-gray-900">$58.00</span>
	<button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	<button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
	</svg>
	</button>
	</div>
	</div>
	<img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400">
	</div>
	</div>
	</section>	

	`,
	category: 'Content',
});


editor.BlockManager.add('landing-block-content-16', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/16.png"/>
	<div class="my-label-block">Content 16</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<h1 class="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">Raw Denim Heirloom Man Braid
	<br class="hidden sm:block">Selfies Wayfarers
	</h1>
	<div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
	<div class="p-4 md:w-1/3 flex">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4 md:w-1/3 flex">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4 md:w-1/3 flex">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">Neptune</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-17', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/17.png"/>
	<div class="my-label-block">Content 17</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="text-center mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
	<p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
	<div class="flex mt-6 justify-center">
	<div class="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
	</div>
	</div>
	<div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
	<div class="p-4 md:w-1/3 flex flex-col text-center items-center">
	<div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4 md:w-1/3 flex flex-col text-center items-center">
	<div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4 md:w-1/3 flex flex-col text-center items-center">
	<div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">Neptune</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-18', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/18.png"/>
	<div class="my-label-block">Content 18</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
	<img alt="feature" class="object-cover object-center h-full w-full" src="https://dummyimage.com/460x500">
	</div>
	<div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
	<div class="flex flex-col mb-10 lg:items-start items-center">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col mb-10 lg:items-start items-center">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-col mb-10 lg:items-start items-center">
	<div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">Neptune</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-19', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/19.png"/>
	<div class="my-label-block">Content 19</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="flex flex-wrap -m-4">
	<div class="p-4 lg:w-1/2 md:w-full">
	<div class="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
	<div class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-8 h-8" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/2 md:w-full">
	<div class="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
	<div class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-20', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/20.png"/>
	<div class="my-label-block">Content 20</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
	<h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 md:w-1/3">
	<div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
	<div class="flex items-center mb-3">
	<div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<h2 class="text-gray-900 text-lg title-font font-medium">Shooting Stars</h2>
	</div>
	<div class="flex-grow">
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="p-4 md:w-1/3">
	<div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
	<div class="flex items-center mb-3">
	<div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<h2 class="text-gray-900 text-lg title-font font-medium">The Catalyzer</h2>
	</div>
	<div class="flex-grow">
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="p-4 md:w-1/3">
	<div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
	<div class="flex items-center mb-3">
	<div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	<h2 class="text-gray-900 text-lg title-font font-medium">Neptune</h2>
	</div>
	<div class="flex-grow">
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-21', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/21.png"/>
	<div class="my-label-block">Content 21</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
	<div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">Shooting Stars</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
	<div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">The Catalyzer</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	<div class="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
	<circle cx="6" cy="6" r="3"></circle>
	<circle cx="6" cy="18" r="3"></circle>
	<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
	</svg>
	</div>
	</div>
	<div class="flex items-center lg:w-3/5 mx-auto sm:flex-row flex-col">
	<div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
	<h2 class="text-gray-900 text-lg title-font font-medium mb-2">The 400 Blows</h2>
	<p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<button class="flex mx-auto mt-20 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-22', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/22.png"/>
	<div class="my-label-block">Content 22</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="text-center mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
	<p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
	</div>
	<div class="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">Authentic Cliche Forage</span>
	</div>
	</div>
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">Kinfolk Chips Snackwave</span>
	</div>
	</div>
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">Coloring Book Ethical</span>
	</div>
	</div>
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">Typewriter Polaroid Cray</span>
	</div>
	</div>
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">Pack Truffaut Blue</span>
	</div>
	</div>
	<div class="p-2 sm:w-1/2 w-full">
	<div class="bg-gray-100 rounded flex p-4 h-full items-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	<span class="title-font font-medium">The Catcher In The Rye</span>
	</div>
	</div>
	</div>
	<button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-23', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/23.png"/>
	<div class="my-label-block">Content 23</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="text-center mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
	<p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
	<h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">SHOOTING STARS</h2>
	<nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>First Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Second Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Third Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fourth Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fifth Link
	</a>
	</nav>
	</div>
	<div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
	<h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">THE 400 BLOWS</h2>
	<nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>First Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Second Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Third Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fourth Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fifth Link
	</a>
	</nav>
	</div>
	<div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
	<h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">THE CATALYZER</h2>
	<nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>First Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Second Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Third Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fourth Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fifth Link
	</a>
	</nav>
	</div>
	<div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
	<h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">NEPTUNE</h2>
	<nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>First Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Second Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Third Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fourth Link
	</a>
	<a>
	<span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Fifth Link
	</a>
	</nav>
	</div>
	</div>
	<button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	</section>

	`,
	category: 'Content',
});



editor.BlockManager.add('landing-block-content-24', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/24.png"/>
	<div class="my-label-block">Content 24</div>
	</div>
	`,
	content: `

	<div class="max-w-screen-xl mx-auto p-8">
	<h2 class="text-3xl font-extrabold leading-9 border-b-2 border-gray-100 text-gray-900 mb-12">
	FAQs
	</h2>
	<ul class="flex items-start gap-8 flex-wrap">
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	What is a home energy rating?
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	A home energy rating is an estimated calculation into a homes potential energy usage, which will determine the amount of heating and cooling required to make its occupants comfortable. It produces a star rating dependant on the amount of heating and cooling loads which will be required, from 0 to 10 stars.
	</p>
	</p>
	</li>
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	Why do I need a 6 Star energy rating?
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	In most Australian states the government requires that all new homes and apartments (along with certain types of building extensions) built since 2010 be energy rated and achieve a minimum of 6 Stars.
	</p>
	</p>
	</li>
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	What is the general cost of an energy rating?
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	Simple energy rating prices vary greatly on the size and type of building, generally an energy rating will cost somewhere between $130 to $700+.
	</p>
	</p>
	</li>
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	What information do I need to supply for an energy rating to be completed??
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	The information required to complete a full and comprehensive energy report are the following final working drawings: Site Plan, Floor Plan, Elevations, Sections, Lighting layout and window schedule (including sizes of the existing windows).
	</p>
	</p>
	</li>
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	Does building an extension need an energy rating?
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	Depended on the size of the extension you are building there is a chance that it too will need to be energy rated. It&#x27;s always best to check first before going ahead with construction.
	</p>
	</p>
	</li>
	<li class="w-2/5">
	<p class="text-lg font-medium leading-6 text-gray-900">
	What is the general cost of an energy rating?
	</p>
	<p class="mt-2">
	<p class="text-base leading-6 text-gray-500">
	Depended on the size of the extension you are building there is a chance that it too will need to be energy rated. It&#x27;s always best to check first before going ahead with construction.
	</p>
	</p>
	</li>
	</ul>
	</div>
	

	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-25', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/25.png"/>
	<div class="my-label-block">Content 25</div>
	</div>
	`,
	content: `

	<div class="bg-lightblue py-20 px-4">
	<div class="mx-auto max-w-6xl flex flex-col md:flex-row">
	<h2 class="mr-8 w-full md:w-1/3 text-3xl font-extrabold leading-9">
	Frequently-asked questions
	</h2>
	<dl class="w-full md:w-2/3">
	<dt class="mb-4">
	<h3 class="text-xl font-semibold">
	We already have ongoing projects. Will Valohai easily integrate with them?
	</h3>
	</dt>
	<dd class="mb-16">
	<p>
	Running existing machine learning projects in Valohai is very simple! Integration only requires adding a valohai.yaml configuration file. Moving projects in and out of Valohai is easy – the integration is only the configuration file.
	</p>
	</dd>
	<dt class="mb-4">
	<h3 class="text-xl font-semibold">
	How do you compare to other data science platforms?
	</h3>
	</dt>
	<dd class="mb-16">
	<p>
	We don’t. Valohai isn’t a data science platform; it&#x27;s a Machine Learning Management Platform that handles the whole ML pipeline from feature extraction, to training of your model and to deploying it into production in a reproducible manner. Data science platforms offer hosted notebooks and AutoML solutions.
	</p>
	</dd>
	<dt class="mb-4">
	<h3 class="text-xl font-semibold">
	Does Valohai charge for computation?
	</h3>
	</dt>
	<dd class="mb-16">
	<p>
	Depends. Most of our customers use their own cloud and thus pay for usage according to their own agreements. Valohai doesn&#x27;t charge anything on top of the per-user license fee. If you don&#x27;t have a cloud provider, you can use our AWS, GCP and Azure accounts, and we&#x27;ll only charge you for what you use.
	</p>
	</dd>
	</dl>
	</div>
	</div>
	

	`,
	category: 'Content',
});




editor.BlockManager.add('landing-block-content-26', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/26.png"/>
	<div class="my-label-block">Content 26</div>
	</div>
	`,
	content: `
	
	<div class="sm:flex flex-wrap justify-center items-center text-center gap-8">
	<div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 py-4 bg-white mt-6  shadow-lg rounded-lg dark:bg-gray-800">
	<div class="flex-shrink-0">
	<div class="flex items-center mx-auto justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<h3 class="text-2xl sm:text-xl text-gray-700 font-semibold dark:text-white py-4">
	Website Design
	</h3>
	<p class="text-md  text-gray-500 dark:text-gray-300 py-4">
	Encompassing today’s website design technology to integrated and build solutions relevant to your business.
	</p>
	</div>
	<div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 py-4 mt-6 sm:mt-16 md:mt-20 lg:mt-24 bg-white shadow-lg rounded-lg dark:bg-gray-800">
	<div class="flex-shrink-0">
	<div class="flex items-center mx-auto justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<h3 class="text-2xl sm:text-xl text-gray-700 font-semibold dark:text-white py-4">
	Branding
	</h3>
	<p class="text-md text-gray-500 dark:text-gray-300 py-4">
	Share relevant, engaging, and inspirational brand messages to create a connection with your audience.
	</p>
	</div>
	<div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 mt-6  px-4 py-4 bg-white shadow-lg rounded-lg dark:bg-gray-800">
	<div class="flex-shrink-0">
	<div class="flex items-center mx-auto justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<h3 class="text-2xl sm:text-xl text-gray-700 font-semibold dark:text-white py-4">
	SEO Marketing
	</h3>
	<p class="text-md  text-gray-500 dark:text-gray-300 py-4">
	Let us help you level up your search engine game, explore our solutions for digital marketing for your business.
	</p>
	</div>
	</div>


	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-27', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/27.png"/>
	<div class="my-label-block">Content 27</div>
	</div>
	`,
	content: `
	
	<div class="relative bg-white dark:bg-gray-800 p-4">
	<div class="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-12 lg:items-center">
	<div class="lg:col-start-2 md:pl-20">
	<h4 class="text-2xl leading-8 font-extrabold text-gray-900 dark:text-white tracking-tight sm:leading-9">
	Manage everything
	</h4>
	<ul class="mt-10">
	<li>
	<div class="flex">
	<div class="flex-shrink-0">
	<div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<div class="ml-4">
	<h5 class="text-lg leading-6 text-gray-900 dark:text-white font-bold">
	One-look dashboard
	</h5>
	<p class="mt-2 text-base leading-6 text-gray-500 dark:text-gray-300">
	Know everything about your business in a single glance with your new dashboard.
	</p>
	</div>
	</div>
	</li>
	<li class="mt-10">
	<div class="flex">
	<div class="flex-shrink-0">
	<div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<div class="ml-4">
	<h5 class="text-lg leading-6 text-gray-900 dark:text-white font-bold">
	Orders, managed
	</h5>
	<p class="mt-2 text-base leading-6 text-gray-500 dark:text-gray-300">
	All your orders in one place so you can manage your delivery, collection, asap and pre-orders in one place.
	</p>
	</div>
	</div>
	</li>
	<li class="mt-10">
	<div class="flex">
	<div class="flex-shrink-0">
	<div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	</div>
	</div>
	<div class="ml-4">
	<h5 class="text-lg leading-6 text-gray-900 dark:text-white font-bold">
	Email &amp; SMS Notifications
	</h5>
	<p class="mt-2 text-base leading-6 text-gray-500 dark:text-gray-300">
	Never miss a new order with notifications via your dashboard, by sound, and to your email and phone.
	</p>
	</div>
	</div>
	</li>
	</ul>
	</div>
	<div class="mt-10 -mx-4 md:-mx-12 relative lg:mt-0 lg:col-start-1">
	<img src="/images/object/8.jpg" alt="illustration" class="relative mx-auto shadow-lg rounded w-auto"/>
	</div>
	</div>
	</div>


	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-28', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/28.png"/>
	<div class="my-label-block">Content 28</div>
	</div>
	`,
	content: `
	
	<section>
	<div class="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800">
	<div class="flex flex-wrap -mx-8">
	<div class="w-full lg:w-1/2 px-8">
	<div class="mb-12 lg:mb-0 pb-12 lg:pb-0 border-b lg:border-b-0">
	<h2 class="mb-4 text-3xl lg:text-4xl font-bold font-heading dark:text-white">
	Sed ac magna sit amet risus tristique interdum, at vel velit in hac habitasse platea dictumst.
	</h2>
	<p class="mb-8 leading-loose text-gray-500 dark:text-gray-300">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla, sed porttitor est nibh at nulla. Praesent placerat enim ut ex tincidunt vehicula. Fusce sit amet dui tellus.
	</p>
	<div class="w-full md:w-1/3">
	<button type="button" class="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
	See more
	</button>
	</div>
	</div>
	</div>
	<div class="w-full lg:w-1/2 px-8">
	<ul class="space-y-12">
	<li class="flex -mx-4">
	<div class="px-4">
	<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
	1
	</span>
	</div>
	<div class="px-4">
	<h3 class="my-4 text-xl font-semibold dark:text-white">
	Responsive Elements
	</h3>
	<p class="text-gray-500 dark:text-gray-300 leading-loose">
	All elements are responsive and provide the best display in all screen size. It&#x27;s magic !
	</p>
	</div>
	</li>
	<li class="flex -mx-4">
	<div class="px-4">
	<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
	2
	</span>
	</div>
	<div class="px-4">
	<h3 class="my-4 text-xl font-semibold dark:text-white">
	Flexible Team
	</h3>
	<p class="text-gray-500 dark:text-gray-300 leading-loose">
	Flexibility is the key. All team is available 24/24 and joinable every day on our hotline.
	</p>
	</div>
	</li>
	<li class="flex -mx-4">
	<div class="px-4">
	<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
	3
	</span>
	</div>
	<div class="px-4">
	<h3 class="my-4 text-xl font-semibold dark:text-white">
	Ecologic Software
	</h3>
	<p class="text-gray-500 dark:text-gray-300 leading-loose">
	Our Software are ecologic and responsable. Green is not just a color, it&#x27;s a way of life.
	</p>
	</div>
	</li>
	</ul>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-29', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/29.png"/>
	<div class="my-label-block">Content 29</div>
	</div>
	`,
	content: `

	<div class="container mx-auto px-6 p-6 bg-white dark:bg-gray-800">
	<div class="mb-16 text-center">
	<h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">
	Features
	</h2>
	<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
	A better way to live
	</p>
	</div>
	<div class="flex flex-wrap my-12 dark:text-white">
	<div class="w-full border-b md:w-1/2 md:border-r lg:w-1/3 p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Increase sales
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Receive more sales by selling across multple sales channels instead of just having a single point of entry.
	</p>
	</div>
	<div class="w-full border-b md:w-1/2 lg:w-1/3 lg:border-r p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Overlays
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Apply beautiful overlays to every product image distributed through our platform. A visual touch.
	</p>
	</div>
	<div class="w-full border-b md:w-1/2 md:border-r lg:w-1/3 lg:border-r-0 p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Control
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Apply filters and control which products to sell on each sales channel. E.g. exclude products with low margins.
	</p>
	</div>
	<div class="w-full border-b md:w-1/2 lg:w-1/3 lg:border-r lg:border-b-0 p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Mapping
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Map product categories with each sales channels&#x27; own categories and achieve better results and lower costs.
	</p>
	</div>
	<div class="w-full border-b md:w-1/2 md:border-r md:border-b-0 lg:w-1/3 lg:border-b-0 p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Fill the missing
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Modify products with extra properties and achieve the maximum output for each installed sales channel.
	</p>
	</div>
	<div class="w-full md:w-1/2 lg:w-1/3 p-8">
	<div class="flex items-center mb-6">
	<svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-indigo-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
	</path>
	</svg>
	<div class="ml-4 text-xl">
	Dynamic Texts
	</div>
	</div>
	<p class="leading-loose text-gray-500 dark:text-gray-200 text-md">
	Build unique product titles and descriptions instead of spending days manually editing each product.
	</p>
	</div>
	</div>
	</div>
	

	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-30', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/30.png"/>
	<div class="my-label-block">Content 30</div>
	</div>
	`,
	content: `
	
	<div class="max-w-screen-xl p-4 bg-white dark:bg-gray-800 mx-auto px-4 sm:px-6 lg:px-8 relative py-26 lg:mt-20">
	<div class="relative">
	<div class="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
	<div class="lg:col-start-2 lg:max-w-2xl ml-auto">
	<p class="text-base leading-6 text-indigo-500 font-semibold uppercase">
	Interactive
	</p>
	<h4 class="mt-2 text-2xl leading-8 font-extrabold text-gray-900 dark:text-white sm:text-3xl sm:leading-9">
	Interactivity between team members is the key of the success.
	</h4>
	<p class="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-300">
	Build a simply and powered collaborative space for all your team. Track, share, measure, you have a fully control, it&#x27;s never be simply and efficient.
	</p>
	<ul class="mt-8 md:grid md:grid-cols-2 gap-6">
	<li class="mt-6 lg:mt-0">
	<div class="flex">
	<span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
	<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
	<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd">
	</path>
	</svg>
	</span>
	<span class="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
	Live modifications
	</span>
	</div>
	</li>
	<li class="mt-6 lg:mt-0">
	<div class="flex">
	<span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
	<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
	<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd">
	</path>
	</svg>
	</span>
	<span class="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
	Data tracker
	</span>
	</div>
	</li>
	<li class="mt-6 lg:mt-0">
	<div class="flex">
	<span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
	<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
	<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd">
	</path>
	</svg>
	</span>
	<span class="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
	24/24 support
	</span>
	</div>
	</li>
	<li class="mt-6 lg:mt-0">
	<div class="flex">
	<span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
	<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
	<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd">
	</path>
	</svg>
	</span>
	<span class="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
	Free tips to improve work time
	</span>
	</div>
	</li>
	</ul>
	</div>
	<div class="mt-10 lg:-mx-4 relative relative-20 lg:mt-0 lg:col-start-1">
	<div class="relative space-y-4">
	<div class="flex items-end justify-center lg:justify-start space-x-4">
	<img class="rounded-lg shadow-lg w-32 md:w-56" width="200" src="/images/object/8.jpg" alt="1"/>
	<img class="rounded-lg shadow-lg w-40 md:w-64" width="260" src="/images/landscape/4.jpg" alt="2"/>
	</div>
	<div class="flex items-start justify-center lg:justify-start space-x-4 ml-12">
	<img class="rounded-lg shadow-lg w-24 md:w-40" width="170" src="/images/landscape/3.jpg" alt="3"/>
	<img class="rounded-lg shadow-lg w-32 md:w-56" width="200" src="/images/object/9.jpg" alt="4"/>
	</div>
	</div>
	</div>
	</div>
	</div>
	</div>


	`,
	category: 'Content',
});




editor.BlockManager.add('landing-block-content-31', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/31.png"/>
	<div class="my-label-block">Blog 31</div>
	</div>
	`,
	content: `
	

	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/1.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	New Mac is here !
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supermac is here, 543 cv and 140 000$. This is best racing computer about 7 years on...
	</p>
	</div>
	</a>
	</div>



	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-32', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/32.png"/>
	<div class="my-label-block">Blog 32</div>
	</div>
	`,
	content: `
	

	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/1.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Article
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	Supercharged
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$. This is best racing GT about 7 years on...
	</p>
	</div>
	</a>
	</div>



	`,
	category: 'Content',
});

editor.BlockManager.add('landing-block-content-33', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/33.png"/>
	<div class="my-label-block">Blog 33</div>
	</div>
	`,
	content: `
	

	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/1.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Article
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	Supercharged !
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$. This is best racing GT about 7 years on...
	</p>
	<div class="flex flex-wrap justify-starts items-center mt-4">
	<div class="text-xs mr-2 py-1.5 px-4 text-gray-600 bg-blue-100 rounded-2xl">
	#Car
	</div>
	<div class="text-xs mr-2 py-1.5 px-4 text-gray-600 bg-blue-100 rounded-2xl">
	#Money
	</div>
	</div>
	</div>
	</a>
	</div>



	`,
	category: 'Content',
});
editor.BlockManager.add('landing-block-content-34', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/34.png"/>
	<div class="my-label-block">Blog 31</div>
	</div>
	`,
	content: `
	

	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/1.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Article
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	Supercharged !
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$. This is best racing GT about 7 years on...
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>



	`,
	category: 'Content',
});


editor.BlockManager.add('landing-block-content-35', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/content/35.png"/>
	<div class="my-label-block">Blog 35</div>
	</div>
	`,
	content: `
	
	<div class="w-full bg-white p-12">
	<div class="header flex items-end justify-between mb-12">
	<div class="title">
	<p class="text-4xl font-bold text-gray-800 mb-4">
	Lastest articles
	</p>
	<p class="text-2xl font-light text-gray-400">
	All article are verified by 2 experts and valdiate by the CTO
	</p>
	</div>
	<div class="text-end">
	<form class="flex w-full max-w-sm space-x-3">
	<div class=" relative ">
	<input type="text" id="&quot;form-subscribe-Search" class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter a title"/>
	</div>
	<button class="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
	Search
	</button>
	</form>
	</div>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/1.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Video
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	Work at home
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	Work at home, remote, is the new age of the job, every person can work at home....
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/2.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Oui
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	test
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$ !!
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/3.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Oui
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	test
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$ !!
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/4.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	test
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$ !!
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/5.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	test
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$ !!
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	<div class="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
	<a href="#" class="w-full block h-full">
	<img alt="blog photo" src="/images/blog/6.jpg" class="max-h-40 w-full object-cover"/>
	<div class="bg-white dark:bg-gray-800 w-full p-4">
	<p class="text-indigo-500 text-md font-medium">
	Oui
	</p>
	<p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
	test
	</p>
	<p class="text-gray-400 dark:text-gray-300 font-light text-md">
	The new supercar is here, 543 cv and 140 000$ !!
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col justify-between ml-4 text-sm">
	<p class="text-gray-800 dark:text-white">
	Jean Jacques
	</p>
	<p class="text-gray-400 dark:text-gray-300">
	20 mars 2029 - 6 min read
	</p>
	</div>
	</div>
	</div>
	</a>
	</div>
	</div>
	</div>




	`,
	category: 'Content',
});











//////////////////////////////////////////////
//  HERO
/////////////////////////////////////////



editor.BlockManager.add('landing-block-hero-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/1.png"/>
	<div class="my-label-block">Hero 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
	<div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Before they sold out
	<br class="hidden lg:inline-block">readymade gluten
	</h1>
	<p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
	<div class="flex justify-center">
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
	</div>
	</div>
	<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	</div>
	</div>
	</section>


	`,
	category: 'Hero',
});

editor.BlockManager.add('landing-block-hero-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/2.png"/>
	<div class="my-label-block">Hero 2</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
	<img class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	<div class="text-center lg:w-2/3 w-full">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Microdosing synth tattooed vexillologist</h1>
	<p class="mb-8 leading-relaxed">Meggings kinfolk echo park stumptown DIY, kale chips beard jianbing tousled. Chambray dreamcatcher trust fund, kitsch vice godard disrupt ramps hexagon mustache umami snackwave tilde chillwave ugh. Pour-over meditation PBR&B pickled ennui celiac mlkshk freegan photo booth af fingerstache pitchfork.</p>
	<div class="flex justify-center">
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Hero',
});
editor.BlockManager.add('landing-block-hero-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/3.png"/>
	<div class="my-label-block">Hero 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
	<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	</div>
	<div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Before they sold out
	<br class="hidden lg:inline-block">readymade gluten
	</h1>
	<p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
	<div class="flex justify-center">
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Hero',
});
editor.BlockManager.add('landing-block-hero-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/4.png"/>
	<div class="my-label-block">Hero 4</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
	<div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
	<p class="mb-8 leading-relaxed">Chillwave portland ugh, knausgaard fam polaroid iPhone. Man braid swag typewriter affogato, hella selvage wolf narwhal dreamcatcher.</p>
	<div class="flex w-full md:justify-start justify-center items-end">
	<div class="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
	<label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
	<input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	<p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
	<div class="flex lg:flex-row md:flex-col">
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
	<path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">GET IT ON</span>
	<span class="title-font font-medium">Google Play</span>
	</span>
	</button>
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center lg:ml-4 md:ml-0 ml-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
	<path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
	<path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">Download on the</span>
	<span class="title-font font-medium">App Store</span>
	</span>
	</button>
	</div>
	</div>
	<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	</div>
	</div>
	</section>

	`,
	category: 'Hero',
});
editor.BlockManager.add('landing-block-hero-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/5.png"/>
	<div class="my-label-block">Hero 5</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
	<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	</div>
	<div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
	<p class="mb-8 leading-relaxed">Chillwave portland ugh, knausgaard fam polaroid iPhone. Man braid swag typewriter affogato, hella selvage wolf narwhal dreamcatcher.</p>
	<div class="flex w-full md:justify-start justify-center items-end">
	<div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4">
	<label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
	<input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	<p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
	<div class="flex lg:flex-row md:flex-col">
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
	<path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">GET IT ON</span>
	<span class="title-font font-medium">Google Play</span>
	</span>
	</button>
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center lg:ml-4 md:ml-0 ml-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
	<path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
	<path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">Download on the</span>
	<span class="title-font font-medium">App Store</span>
	</span>
	</button>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Hero',
});
editor.BlockManager.add('landing-block-hero-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/hero/6.png"/>
	<div class="my-label-block">Hero 6</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container mx-auto flex flex-col px-5 py-24 justify-center items-center">
	<img class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	<div class="w-full md:w-2/3 flex flex-col mb-16 items-center text-center">
	<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
	<p class="mb-8 leading-relaxed">Kickstarter biodiesel roof party wayfarers cold-pressed. Palo santo live-edge tumeric scenester copper mug flexitarian. Prism vice offal plaid everyday carry. Gluten-free chia VHS squid listicle artisan.</p>
	<div class="flex w-full justify-center items-end">
	<div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
	<label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
	<input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	<p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
	<div class="flex">
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
	<path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">GET IT ON</span>
	<span class="title-font font-medium">Google Play</span>
	</span>
	</button>
	<button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center ml-4 hover:bg-gray-200 focus:outline-none">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
	<path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
	<path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
	</svg>
	<span class="ml-4 flex items-start flex-col leading-none">
	<span class="text-xs text-gray-600 mb-1">Download on the</span>
	<span class="title-font font-medium">App Store</span>
	</span>
	</button>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Hero',
});






////////////////////////
//  STATISTIC
/////////////////////



editor.BlockManager.add('landing-block-statistic-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/statistic/1.png"/>
	<div class="my-label-block">Statistic 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4 text-center">
	<div class="p-4 sm:w-1/4 w-1/2">
	<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">2.7K</h2>
	<p class="leading-relaxed">Users</p>
	</div>
	<div class="p-4 sm:w-1/4 w-1/2">
	<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">1.8K</h2>
	<p class="leading-relaxed">Subscribes</p>
	</div>
	<div class="p-4 sm:w-1/4 w-1/2">
	<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">35</h2>
	<p class="leading-relaxed">Downloads</p>
	</div>
	<div class="p-4 sm:w-1/4 w-1/2">
	<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">4</h2>
	<p class="leading-relaxed">Products</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Statistic',
});

editor.BlockManager.add('landing-block-statistic-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/statistic/2.png"/>
	<div class="my-label-block">Statistic 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
	<div class="w-full sm:p-4 px-4 mb-6">
	<h1 class="title-font font-medium text-xl mb-2 text-gray-900">Moon hashtag pop-up try-hard offal truffaut</h1>
	<div class="leading-relaxed">Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar neutra sustainable fingerstache kickstarter.</div>
	</div>
	<div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
	<h2 class="title-font font-medium text-3xl text-gray-900">2.7K</h2>
	<p class="leading-relaxed">Users</p>
	</div>
	<div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
	<h2 class="title-font font-medium text-3xl text-gray-900">1.8K</h2>
	<p class="leading-relaxed">Subscribes</p>
	</div>
	<div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
	<h2 class="title-font font-medium text-3xl text-gray-900">35</h2>
	<p class="leading-relaxed">Downloads</p>
	</div>
	<div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
	<h2 class="title-font font-medium text-3xl text-gray-900">4</h2>
	<p class="leading-relaxed">Products</p>
	</div>
	</div>
	<div class="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
	<img class="object-cover object-center w-full h-full" src="https://dummyimage.com/600x300" alt="stats">
	</div>
	</div>
	</section>

	`,
	category: 'Statistic',
});
editor.BlockManager.add('landing-block-statistic-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/statistic/3.png"/>
	<div class="my-label-block">Statistic 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
	</div>
	<div class="flex flex-wrap -m-4 text-center">
	<div class="p-4 md:w-1/4 sm:w-1/2 w-full">
	<div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
	<path d="M8 17l4 4 4-4m-4-5v9"></path>
	<path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
	</svg>
	<h2 class="title-font font-medium text-3xl text-gray-900">2.7K</h2>
	<p class="leading-relaxed">Downloads</p>
	</div>
	</div>
	<div class="p-4 md:w-1/4 sm:w-1/2 w-full">
	<div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
	<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
	<circle cx="9" cy="7" r="4"></circle>
	<path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
	</svg>
	<h2 class="title-font font-medium text-3xl text-gray-900">1.3K</h2>
	<p class="leading-relaxed">Users</p>
	</div>
	</div>
	<div class="p-4 md:w-1/4 sm:w-1/2 w-full">
	<div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
	<path d="M3 18v-6a9 9 0 0118 0v6"></path>
	<path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
	</svg>
	<h2 class="title-font font-medium text-3xl text-gray-900">74</h2>
	<p class="leading-relaxed">Files</p>
	</div>
	</div>
	<div class="p-4 md:w-1/4 sm:w-1/2 w-full">
	<div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>
	<h2 class="title-font font-medium text-3xl text-gray-900">46</h2>
	<p class="leading-relaxed">Places</p>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Statistic',
});







////////////////////////
//  STEP
/////////////////////



editor.BlockManager.add('landing-block-step-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/step/1.png"/>
	<div class="my-label-block">Step 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="flex flex-wrap w-full">
	<div class="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
	<div class="flex relative pb-12">
	<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>
	</div>
	<div class="flex-grow pl-4">
	<h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 1</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	<div class="flex relative pb-12">
	<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow pl-4">
	<h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 2</h2>
	<p class="leading-relaxed">Vice migas literally kitsch +1 pok pok. Truffaut hot chicken slow-carb health goth, vape typewriter.</p>
	</div>
	</div>
	<div class="flex relative pb-12">
	<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<circle cx="12" cy="5" r="3"></circle>
	<path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
	</svg>
	</div>
	<div class="flex-grow pl-4">
	<h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 3</h2>
	<p class="leading-relaxed">Coloring book nar whal glossier master cleanse umami. Salvia +1 master cleanse blog taiyaki.</p>
	</div>
	</div>
	<div class="flex relative pb-12">
	<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow pl-4">
	<h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 4</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	<div class="flex relative">
	<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
	<path d="M22 4L12 14.01l-3-3"></path>
	</svg>
	</div>
	<div class="flex-grow pl-4">
	<h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">FINISH</h2>
	<p class="leading-relaxed">Pitchfork ugh tattooed scenester echo park gastropub whatever cold-pressed retro.</p>
	</div>
	</div>
	</div>
	<img class="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://dummyimage.com/1200x500" alt="step">
	</div>
	</div>
	</section>

	`,
	category: 'Step',
});


editor.BlockManager.add('landing-block-step-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/step/2.png"/>
	<div class="my-label-block">Step 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap flex-col">
	<div class="flex mx-auto flex-wrap mb-20">
	<a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium bg-gray-100 inline-flex items-center leading-none border-indigo-500 text-indigo-500 tracking-wider rounded-t">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>STEP 1
	</a>
	<a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>STEP 2
	</a>
	<a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
	<circle cx="12" cy="5" r="3"></circle>
	<path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
	</svg>STEP 3
	</a>
	<a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>STEP 4
	</a>
	</div>
	<img class="xl:w-1/4 lg:w-1/3 md:w-1/2 w-2/3 block mx-auto mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
	<div class="flex flex-col text-center w-full">
	<h1 class="text-xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
	</div>
	</div>
	</section>

	`,
	category: 'Step',
});
editor.BlockManager.add('landing-block-step-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/step/3.png"/>
	<div class="my-label-block">Step 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
	<div class="h-full w-6 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">1</div>
	<div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
	<div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	</svg>
	</div>
	<div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
	<h2 class="font-medium title-font text-gray-900 mb-1 text-xl">Shooting Stars</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	</div>
	<div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
	<div class="h-full w-6 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">2</div>
	<div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
	<div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
	<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	</div>
	<div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
	<h2 class="font-medium title-font text-gray-900 mb-1 text-xl">The Catalyzer</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	</div>
	<div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
	<div class="h-full w-6 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">3</div>
	<div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
	<div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
	<circle cx="12" cy="5" r="3"></circle>
	<path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
	</svg>
	</div>
	<div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
	<h2 class="font-medium title-font text-gray-900 mb-1 text-xl">The 400 Blows</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	</div>
	<div class="flex relative pb-10 sm:items-center md:w-2/3 mx-auto">
	<div class="h-full w-6 absolute inset-0 flex items-center justify-center">
	<div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
	</div>
	<div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">4</div>
	<div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
	<div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
	<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
	</svg>
	</div>
	<div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
	<h2 class="font-medium title-font text-gray-900 mb-1 text-xl">Neptune</h2>
	<p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Step',
});







////////////////////////
//  TEAM
/////////////////////



editor.BlockManager.add('landing-block-team-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/1.png"/>
	<div class="my-label-block">Team 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Our Team</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
	</div>
	<div class="flex flex-wrap -m-2">
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/80x80">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Holden Caulfield</h2>
	<p class="text-gray-500">UI Designer</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/84x84">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Henry Letham</h2>
	<p class="text-gray-500">CTO</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/88x88">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Oskar Blinde</h2>
	<p class="text-gray-500">Founder</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/90x90">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">John Doe</h2>
	<p class="text-gray-500">DevOps</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/94x94">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Martin Eden</h2>
	<p class="text-gray-500">Software Engineer</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/98x98">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Boris Kitua</h2>
	<p class="text-gray-500">UX Researcher</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/100x90">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Atticus Finch</h2>
	<p class="text-gray-500">QA Engineer</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/104x94">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Alper Kamu</h2>
	<p class="text-gray-500">System</p>
	</div>
	</div>
	</div>
	<div class="p-2 lg:w-1/3 md:w-1/2 w-full">
	<div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
	<img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/108x98">
	<div class="flex-grow">
	<h2 class="text-gray-900 title-font font-medium">Rodrigo Monchi</h2>
	<p class="text-gray-500">Product Manager</p>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Team',
});

editor.BlockManager.add('landing-block-team-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/2.png"/>
	<div class="my-label-block">Team 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest">OUR TEAM</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 lg:w-1/2">
	<div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
	<img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/200x200">
	<div class="flex-grow sm:pl-8">
	<h2 class="title-font font-medium text-lg text-gray-900">Holden Caulfield</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/2">
	<div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
	<img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/201x201">
	<div class="flex-grow sm:pl-8">
	<h2 class="title-font font-medium text-lg text-gray-900">Alper Kamu</h2>
	<h3 class="text-gray-500 mb-3">Designer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/2">
	<div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
	<img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/204x204">
	<div class="flex-grow sm:pl-8">
	<h2 class="title-font font-medium text-lg text-gray-900">Atticus Finch</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/2">
	<div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
	<img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/206x206">
	<div class="flex-grow sm:pl-8">
	<h2 class="title-font font-medium text-lg text-gray-900">Henry Letham</h2>
	<h3 class="text-gray-500 mb-3">Designer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Team',
});
editor.BlockManager.add('landing-block-team-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/3.png"/>
	<div class="my-label-block">Team 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="text-2xl font-medium title-font mb-4 text-gray-900">OUR TEAM</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 lg:w-1/4 md:w-1/2">
	<div class="h-full flex flex-col items-center text-center">
	<img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/200x200">
	<div class="w-full">
	<h2 class="title-font font-medium text-lg text-gray-900">Alper Kamu</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/4 md:w-1/2">
	<div class="h-full flex flex-col items-center text-center">
	<img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/201x201">
	<div class="w-full">
	<h2 class="title-font font-medium text-lg text-gray-900">Holden Caulfield</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/4 md:w-1/2">
	<div class="h-full flex flex-col items-center text-center">
	<img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/202x202">
	<div class="w-full">
	<h2 class="title-font font-medium text-lg text-gray-900">Atticus Finch</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/4 md:w-1/2">
	<div class="h-full flex flex-col items-center text-center">
	<img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/203x203">
	<div class="w-full">
	<h2 class="title-font font-medium text-lg text-gray-900">Henry Letham</h2>
	<h3 class="text-gray-500 mb-3">UI Developer</h3>
	<p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-2 text-gray-500">
	<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Team',
});


editor.BlockManager.add('landing-block-team-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/4.png"/>
	<div class="my-label-block">Team 4</div>
	</div>
	`,
	content: `
	

	<div class="p-4">
	<div class="text-center mb-4 opacity-90">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-40 w-40 "/>
	</a>
	</div>
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Patrick Sebastien
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Developpeur
	</p>
	<p class="text-md text-gray-500 dark:text-gray-400 max-w-xs py-4 font-light">
	Patrick Sébastien, born November 14, 1953 in Brive-la-Gaillarde, is an imitator, humorist, actor, director, singer, songwriter, poet, writer
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>


	`,
	category: 'Team',
});
editor.BlockManager.add('landing-block-team-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/5.png"/>
	<div class="my-label-block">Team 5</div>
	</div>
	`,
	content: `
	
	<div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
	<p class="text-center text-3xl font-bold text-gray-800 dark:text-white">
	Professional team
	</p>
	<p class="text-center mb-12 text-xl font-normal text-gray-500 dark:text-gray-200">
	Meat the best team in wolrd
	</p>
	<div class="flex items-center flex-col md:flex-row justify evenly">
	<div class="p-4">
	<div class="text-center mb-4 opacity-90">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-40 w-40 "/>
	</a>
	</div>
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Patrick Sebastien
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Developpeur
	</p>
	<p class="text-md text-gray-500 dark:text-gray-400 max-w-xs py-4 font-light">
	Patrick Sébastien, born November 14, 1953 in Brive-la-Gaillarde, is an imitator.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4">
	<div class="text-center mb-4 opacity-90">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/4.jpg" class="mx-auto object-cover rounded-full h-40 w-40 "/>
	</a>
	</div>
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Jean Castux
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Founder
	</p>
	<p class="text-md text-gray-500 dark:text-gray-400 max-w-xs py-4 font-light">
	Jean Castux is an imitator, humorist, actor, born November 14, 1953 in Pontivy.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	<div class="p-4">
	<div class="text-center mb-4 opacity-90">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/3.jpg" class="mx-auto object-cover rounded-full h-40 w-40 "/>
	</a>
	</div>
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Thierry Halliday
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	CTO
	</p>
	<p class="text-md text-gray-500 dark:text-gray-400 max-w-xs py-4 font-light">
	Thierry Halliday, born November 4, 1993 in Saint hilaire de riez, is css specialist.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-44 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>


	`,
	category: 'Team',
});editor.BlockManager.add('landing-block-team-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/6.png"/>
	<div class="my-label-block">Team 6</div>
	</div>
	`,
	content: `
	
	<div class="p-4 relative">
	<div class="text-center mb-4 absolute -top-16 right-1/2 transform translate-x-1/2">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/2.jpeg" class="mx-auto object-cover rounded-lg h-40 w-40  border-2 border-white dark:border-gray-800"/>
	</a>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow px-8 py-4 pt-24">
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Charlie
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Lead dev
	</p>
	<p class="text-md text-gray-500 w-60 dark:text-gray-400 mx-auto py-4 font-light">
	Charlie, born December 18, 1993 in Challans, is an imitator.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-40 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	</div>


	`,
	category: 'Team',
});editor.BlockManager.add('landing-block-team-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/7.png"/>
	<div class="my-label-block">Team 7</div>
	</div>
	`,
	content: `
	
	<div class="p-4">
	<p class="text-center text-3xl font-bold text-gray-800">
	Professional team
	</p>
	<p class="text-center mb-32 text-xl font-normal text-gray-500">
	Meat the best team in wolrd
	</p>
	<div class="flex items-center flex-col md:flex-row justify evenly">
	<div class="p-4 relative">
	<div class="text-center mb-4 absolute -top-16 right-1/2 transform translate-x-1/2">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-lg h-40 w-40  border-2 border-white dark:border-gray-800"/>
	</a>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow px-8 py-4 pt-24">
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Patrick Sebastien
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Developpeur
	</p>
	<p class="text-md text-gray-500 w-60 dark:text-gray-400 mx-auto py-4 font-light">
	Patrick Sébastien, born November 14, 1953 in Brive-la-Gaillarde, is an imitator.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-40 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="p-4 relative">
	<div class="text-center mb-4 absolute -top-16 right-1/2 transform translate-x-1/2">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/2.jpeg" class="mx-auto object-cover rounded-lg h-40 w-40  border-2 border-white dark:border-gray-800"/>
	</a>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow px-8 py-4 pt-24">
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Charlie
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	Lead dev
	</p>
	<p class="text-md text-gray-500 w-60 dark:text-gray-400 mx-auto py-4 font-light">
	Charlie, born December 18, 1993 in Challans, is an imitator and pintor.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-40 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="p-4 relative">
	<div class="text-center mb-4 absolute -top-16 right-1/2 transform translate-x-1/2">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/4.jpg" class="mx-auto object-cover rounded-lg h-40 w-40  border-2 border-white dark:border-gray-800"/>
	</a>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow px-8 py-4 pt-24">
	<div class="text-center">
	<p class="text-2xl text-gray-800 dark:text-white">
	Thierry Halliday
	</p>
	<p class="text-xl text-gray-500 dark:text-gray-200 font-light">
	CTO
	</p>
	<p class="text-md text-gray-500 w-60 dark:text-gray-400 mx-auto py-4 font-light">
	Thierry Halliday, born November 4, 1993 in Saint hilaire de riez, is css specialist.
	</p>
	</div>
	<div class="pt-8 flex border-t border-gray-200 w-40 mx-auto text-gray-500 items-center justify-between">
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
	<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
	</path>
	</svg>
	</a>
	<a href="#">
	<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
	</path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>


	`,
	category: 'Team',
});editor.BlockManager.add('landing-block-team-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/8.png"/>
	<div class="my-label-block">Team 8</div>
	</div>
	`,
	content: `
	
	<div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
	<p class="text-center text-3xl font-bold text-gray-800 dark:text-white">
	The big team
	</p>
	<p class="text-center mb-12 text-xl font-normal text-gray-500 dark:text-gray-300">
	Meat the best team in wolrd
	</p>
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/4.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Hean Hiut
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/5.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Igor Novak
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Jig sa Hiut
	</span>
	<span class="text-gray-400 text-xs">
	Boucher
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/7.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Norman Tuck
	</span>
	<span class="text-gray-400 text-xs">
	Architect
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/8.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Masrt kik
	</span>
	<span class="text-gray-400 text-xs">
	Chef
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/9.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Louis Bol
	</span>
	<span class="text-gray-400 text-xs">
	Sdf
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/10.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Izno god
	</span>
	<span class="text-gray-400 text-xs">
	American
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Serena Quille
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Edouard Sert
	</span>
	<span class="text-gray-400 text-xs">
	Developer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/8.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Parki Son
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/9.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Marine Lo
	</span>
	<span class="text-gray-400 text-xs">
	SEO
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/4.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Mickal Poul
	</span>
	<span class="text-gray-400 text-xs">
	Freelance
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/5.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Isac Tou
	</span>
	<span class="text-gray-400 text-xs">
	Freelance
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Jean Eu
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/9.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Yves P
	</span>
	<span class="text-gray-400 text-xs">
	Humor
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Marco Tol
	</span>
	<span class="text-gray-400 text-xs">
	Designer
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/6.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Huge Ar
	</span>
	<span class="text-gray-400 text-xs">
	CEA
	</span>
	</div>
	</div>
	</div>
	<div class="p-4">
	<div class="flex-col  flex justify-center items-center">
	<div class="flex-shrink-0">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/8.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="mt-2 text-center flex flex-col">
	<span class="text-gray-600 dark:text-white text-lg font-medium">
	Big Bro
	</span>
	<span class="text-gray-400 text-xs">
	CTO
	</span>
	</div>
	</div>
	</div>
	</div>
	</div>


	`,
	category: 'Team',
});editor.BlockManager.add('landing-block-team-9', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/team/9.png"/>
	<div class="my-label-block">Team 9</div>
	</div>
	`,
	content: `
	
	<div class="md:flex gap-8">
	<div class="md:w-1/2 text-center mb-8 md:mb-0">
	<img class="w-48 h-48 rounded-full mx-auto -mb-24" src="/images/person/6.jpg" alt="Avatar Jacky"/>
	<div class="bg-white shadow-lg rounded-lg px-8 pt-32 pb-10 text-gray-400">
	<h3 class="font-title text-gray-800 text-xl mb-3">
	Jacky Pout
	</h3>
	<p class="font-body">
	FullStack Engineer
	</p>
	<p class="font-body text-sm mb-4">
	He love caramel and he hate PHP
	</p>
	<a class="font-body text-blue-500 hover:text-gray-800" href="#">
	Jacky@poute.com
	</a>
	</div>
	</div>
	<div class="md:w-1/2 text-center">
	<img class="w-48 h-48 rounded-full mx-auto -mb-24" src="/images/person/10.jpg" alt="Avatar Damien Marley"/>
	<div class="bg-white shadow-lg rounded-lg px-8 pt-32 pb-10 text-gray-400">
	<h3 class="font-title text-gray-800 text-xl mb-3">
	Damien Marley
	</h3>
	<p class="font-body">
	CEO
	</p>
	<p class="font-body text-sm mb-4">
	He&#x27;s fun and listen everyday Bob Marley
	</p>
	<a class="font-body text-blue-500 hover:text-gray-800" href="mailto:dino@siete.pm">
	Damien@marley.com
	</a>
	</div>
	</div>
	</div>


	`,
	category: 'Team',
});






////////////////////////
//  TESTIMONIAL
/////////////////////



editor.BlockManager.add('landing-block-testimonial-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/1.png"/>
	<div class="my-label-block">Testimonial 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<h1 class="text-3xl font-medium title-font text-gray-900 mb-12 text-center">Testimonials</h1>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 md:w-1/2 w-full">
	<div class="h-full bg-gray-100 p-8 rounded">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
	<path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
	</svg>
	<p class="leading-relaxed mb-6">Synth chartreuse iPhone lomo cray raw denim brunch everyday carry neutra before they sold out fixie 90's microdosing. Tacos pinterest fanny pack venmo, post-ironic heirloom try-hard pabst authentic iceland.</p>
	<a class="inline-flex items-center">
	<img alt="testimonial" src="https://dummyimage.com/106x106" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-4">
	<span class="title-font font-medium text-gray-900">Holden Caulfield</span>
	<span class="text-gray-500 text-sm">UI DEVELOPER</span>
	</span>
	</a>
	</div>
	</div>
	<div class="p-4 md:w-1/2 w-full">
	<div class="h-full bg-gray-100 p-8 rounded">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
	<path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
	</svg>
	<p class="leading-relaxed mb-6">Synth chartreuse iPhone lomo cray raw denim brunch everyday carry neutra before they sold out fixie 90's microdosing. Tacos pinterest fanny pack venmo, post-ironic heirloom try-hard pabst authentic iceland.</p>
	<a class="inline-flex items-center">
	<img alt="testimonial" src="https://dummyimage.com/107x107" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-4">
	<span class="title-font font-medium text-gray-900">Alper Kamu</span>
	<span class="text-gray-500 text-sm">DESIGNER</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/2.png"/>
	<div class="my-label-block">Testimonial 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="inline-block w-8 h-8 text-gray-400 mb-8" viewBox="0 0 975.036 975.036">
	<path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
	</svg>
	<p class="leading-relaxed text-lg">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware. Man bun next level coloring book skateboard four loko knausgaard. Kitsch keffiyeh master cleanse direct trade indigo juice before they sold out gentrify plaid gastropub normcore XOXO 90's pickled cindigo jean shorts. Slow-carb next level shoindigoitch ethical authentic, yr scenester sriracha forage franzen organic drinking vinegar.</p>
	<span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
	<h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HOLDEN CAULFIELD</h2>
	<p class="text-gray-500">Senior Product Designer</p>
	</div>
	</div>
	</section>

	`,
	category: 'Testimonial',
});

editor.BlockManager.add('landing-block-testimonial-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/3.png"/>
	<div class="my-label-block">Testimonial 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4">
	<div class="lg:w-1/3 lg:mb-0 mb-6 p-4">
	<div class="h-full text-center">
	<img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/302x302">
	<p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
	<h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HOLDEN CAULFIELD</h2>
	<p class="text-gray-500">Senior Product Designer</p>
	</div>
	</div>
	<div class="lg:w-1/3 lg:mb-0 mb-6 p-4">
	<div class="h-full text-center">
	<img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/300x300">
	<p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
	<h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">ALPER KAMU</h2>
	<p class="text-gray-500">UI Develeoper</p>
	</div>
	</div>
	<div class="lg:w-1/3 lg:mb-0 p-4">
	<div class="h-full text-center">
	<img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/305x305">
	<p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
	<span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
	<h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HENRY LETHAM</h2>
	<p class="text-gray-500">CTO</p>
	</div>
	</div>
	</div>
	</div>
	</section>
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/4.png"/>
	<div class="my-label-block">Testimonial 4</div>
	</div>
	`,
	content: `

	<div class="bg-white dark:bg-gray-800 w-72 shadow-lg mx-auto rounded-xl p-4">
	<p class="text-gray-600 dark:text-white">
	<span class="font-bold text-indigo-500 text-lg">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500 text-lg">
	”
	</span>
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col ml-2 justify-between">
	<span class="font-semibold text-indigo-500 text-sm">
	Jean Miguel
	</span>
	<span class="dark:text-gray-400 text-xs flex items-center">
	User of Tail-Kit
	<img src="/icons/rocket.svg" class="ml-2 h-4 w-4"/>
	</span>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});

editor.BlockManager.add('landing-block-testimonial-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/5.png"/>
	<div class="my-label-block">Testimonial 5</div>
	</div>
	`,
	content: `

	<div class="flex items-center justify-center px-5 py-5">
	<div class="w-full mx-auto max-w-xl rounded-lg bg-white dark:bg-gray-800 shadow-lg px-5 pt-5 pb-10 text-gray-800 dark:text-gray-50">
	<div class="w-full pt-1 text-center pb-5 -mt-16 mx-auto">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-20 w-20 "/>
	</a>
	</div>
	<div class="w-full mb-10">
	<div class="text-3xl text-indigo-500 text-left leading-tight h-3">
	“
	</div>
	<p class="text-sm text-gray-600 dark:text-gray-100 text-center px-5">
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	</p>
	<div class="text-3xl text-indigo-500 text-right leading-tight h-3 -mt-3">
	”
	</div>
	</div>
	<div class="w-full">
	<p class="text-md text-indigo-500 font-bold text-center">
	Tom Hardy
	</p>
	<p class="text-xs text-gray-500 dark:text-gray-300 text-center">
	@thom.hardy
	</p>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/6.png"/>
	<div class="my-label-block">Testimonial 6</div>
	</div>
	`,
	content: `

	<div class="bg-white dark:bg-gray-800 w-full mx-auto p-8">
	<img src="/icons/rocket.svg" class="h-10 w-10 mb-8 m-auto"/>
	<p class="text-gray-600 dark:text-white w-full md:w-2/3 m-auto text-center text-lg md:text-3xl">
	<span class="font-bold text-indigo-500">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500">
	”
	</span>
	</p>
	<div class="flex items-center justify-center mt-8">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex ml-2 items-center justify-center">
	<span class="font-semibold text-indigo-500 mr-2 text-lg">
	Jean Miguel
	</span>
	<span class="text-gray-400 text-xl font-light">
	/
	</span>
	<span class="text-gray-400 text-md ml-2">
	User of Tail-Kit
	</span>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/7.png"/>
	<div class="my-label-block">Testimonial 7</div>
	</div>
	`,
	content: `


	<div class="bg-white dark:bg-gray-800 w-full mx-auto p-8">
	<div class="flex items-center md:items-start flex-col md:flex-row justify-center">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-40 w-40 "/>
	</a>
	<div class="w-full md:w-2/3">
	<p class="text-gray-600 dark:text-white w-full md:w-2/3 m-auto text-left text-lg md:text-3xl">
	<span class="font-bold text-indigo-500">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500">
	”
	</span>
	</p>
	<div class="flex mt-8 items-center justify-center">
	<span class="font-semibold text-indigo-500 mr-2 text-lg">
	Jean Miguel
	</span>
	<span class="text-gray-400 text-xl font-light">
	/
	</span>
	<span class="text-gray-400 text-md ml-2">
	User of tail-kit
	</span>
	</div>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/8.png"/>
	<div class="my-label-block">Testimonial 8</div>
	</div>
	`,
	content: `

	<div class="w-full flex flex-col md:flex-row gap-4 mb-8 md:mb-0 flex-between items-center p-8">
	<div class="bg-white dark:bg-gray-800 w-72 shadow-lg mx-auto rounded-xl p-4">
	<p class="text-gray-600 dark:text-white">
	<span class="font-bold text-indigo-500 text-lg">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500 text-lg">
	”
	</span>
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col ml-2 justify-between">
	<span class="font-semibold text-indigo-500 text-sm">
	Jean Miguel
	</span>
	<span class="dark:text-gray-400 text-xs flex items-center">
	User of Tail-Kit
	<img src="/icons/rocket.svg" class="ml-2 h-4 w-4"/>
	</span>
	</div>
	</div>
	</div>
	<div class="bg-white dark:bg-gray-800 w-72 shadow-lg mx-auto rounded-xl p-4">
	<p class="text-gray-600 dark:text-white">
	<span class="font-bold text-indigo-500 text-lg">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500 text-lg">
	”
	</span>
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col ml-2 justify-between">
	<span class="font-semibold text-indigo-500 text-sm">
	Jean Miguel
	</span>
	<span class="dark:text-gray-400 text-xs flex items-center">
	User of Tail-Kit
	<img src="/icons/rocket.svg" class="ml-2 h-4 w-4"/>
	</span>
	</div>
	</div>
	</div>
	<div class="bg-white dark:bg-gray-800 w-72 shadow-lg mx-auto rounded-xl p-4">
	<p class="text-gray-600 dark:text-white">
	<span class="font-bold text-indigo-500 text-lg">
	“
	</span>
	To get social media testimonials like these, keep your customers engaged with your social media accounts by posting regularly yourself
	<span class="font-bold text-indigo-500 text-lg">
	”
	</span>
	</p>
	<div class="flex items-center mt-4">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-10 w-10 "/>
	</a>
	<div class="flex flex-col ml-2 justify-between">
	<span class="font-semibold text-indigo-500 text-sm">
	Jean Miguel
	</span>
	<span class="dark:text-gray-400 text-xs flex items-center">
	User of Tail-Kit
	<img src="/icons/rocket.svg" class="ml-2 h-4 w-4"/>
	</span>
	</div>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-9', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/9.png"/>
	<div class="my-label-block">Testimonial 9</div>
	</div>
	`,
	content: `

	<div class="bg-white dark:bg-gray-800 w-full rounded-lg p-4 mb-6 shadow sm:inline-block">
	<div class="flex items-start text-left">
	<div class="flex-shrink-0">
	<div class="inline-block relative">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/1.jpg" class="mx-auto object-cover rounded-full h-16 w-16 "/>
	</a>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="fill-current text-white bg-green-600 rounded-full p-1 absolute bottom-0 right-0 w-6 h-6 -mx-1 -my-1">
	<path d="M19 11a7.5 7.5 0 0 1-3.5 5.94L10 20l-5.5-3.06A7.5 7.5 0 0 1 1 11V3c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zm-9 1.08l2.92 2.04-1.03-3.41 2.84-2.15-3.56-.08L10 5.12 8.83 8.48l-3.56.08L8.1 10.7l-1.03 3.4L10 12.09z">
	</path>
	</svg>
	</div>
	</div>
	<div class="ml-6">
	<p class="flex items-baseline">
	<span class="text-gray-600 dark:text-gray-200 font-bold">
	A Msan
	</span>
	<span class="text-gray-500 dark:text-gray-300  ml-2 text-sm">
	2 months ago
	</span>
	</p>
	<div class="flex items-center mt-1">
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	</div>
	<div class="mt-3">
	<p class="mt-1 max-w-xs dark:text-white">
	My first job of scanning photos at the Memories 2 Digital Photo Scanning was fantastic. She completed the work quickly while I was waiting. Thanks for a great service..
	</p>
	</div>
	</div>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});


editor.BlockManager.add('landing-block-testimonial-10', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/testimonial/10.png"/>
	<div class="my-label-block">Testimonial 10</div>
	</div>
	`,
	content: `

	<div class="bg-gradient-to-b from-blue-500 w-full md:w-60 to-blue-600 w-full rounded-lg p-4 mb-6 shadow sm:inline-block">
	<div class="flex items-start text-left">
	<div class="flex-shrink-0">
	<div class="inline-block relative">
	<a href="#" class="block relative">
	<img alt="profil" src="/images/person/4.jpg" class="mx-auto object-cover rounded-full h-16 w-16 "/>
	</a>
	</div>
	</div>
	<div class="ml-6">
	<p class="flex items-baseline">
	<span class="text-white">
	Charlie Rabiller
	</span>
	</p>
	<div class="flex items-center mt-1">
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 1792 1792">
	<path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
	</path>
	</svg>
	</div>
	</div>
	</div>
	<div class="mt-3">
	<p class="mt-1 max-w-xs font-light text-white">
	My first job of scanning photos at the Memories 2 Digital Photo Scanning was fantastic. She completed the work quickly while I was waiting. Thanks for a great service..
	</p>
	</div>
	<div class="flex items-start text-gray-100 mt-6">
	<button class="mr-4 hover:text-white">
	<svg width="25" height="25" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1664 596q0-81-21.5-143t-55-98.5-81.5-59.5-94-31-98-8-112 25.5-110.5 64-86.5 72-60 61.5q-18 22-49 22t-49-22q-24-28-60-61.5t-86.5-72-110.5-64-112-25.5-98 8-94 31-81.5 59.5-55 98.5-21.5 143q0 168 187 355l581 560 580-559q188-188 188-356zm128 0q0 221-229 450l-623 600q-18 18-44 18t-44-18l-624-602q-10-8-27.5-26t-55.5-65.5-68-97.5-53.5-121-23.5-138q0-220 127-344t351-124q62 0 126.5 21.5t120 58 95.5 68.5 76 68q36-36 76-68t95.5-68.5 120-58 126.5-21.5q224 0 351 124t127 344z">
	</path>
	</svg>
	</button>
	<button class="hover:text-white">
	<svg width="25" height="25" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
	<path d="M1344 1024q133 0 226.5 93.5t93.5 226.5-93.5 226.5-226.5 93.5-226.5-93.5-93.5-226.5q0-12 2-34l-360-180q-92 86-218 86-133 0-226.5-93.5t-93.5-226.5 93.5-226.5 226.5-93.5q126 0 218 86l360-180q-2-22-2-34 0-133 93.5-226.5t226.5-93.5 226.5 93.5 93.5 226.5-93.5 226.5-226.5 93.5q-126 0-218-86l-360 180q2 22 2 34t-2 34l360 180q92-86 218-86z">
	</path>
	</svg>
	</button>
	</div>
	</div>

	
	`,
	category: 'Testimonial',
});



































//////////////////////////////////
// AUTHENTICATION
/////////////////////////////////


editor.BlockManager.add('landing-block-authentication-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/authentication/1.png"/>
	<div class="my-label-block">Authentication 1</div>
	</div>
	`,
	content: `

	<section class="flex flex-col items-center h-screen md:flex-row ">
	<div class="hidden w-full h-screen bg-white lg:block md:w-1/3 lg:w-2/3">
	<img src="https://dummyimage.com/1000x800/F3F4F7/64748b"
	alt="" class="object-cover w-full h-full">
	</div>
	<div class="flex items-center justify-center w-full h-screen px-6 bg-white md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12">
	<div class="w-full h-100">
	<a class="flex items-center w-32 mb-4 font-medium text-gray-900 title-font md:mb-0">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="text-lg font-bold tracking-tighter text-black uppercase transition duration-500 ease-in-out transform hover:text-lightBlue-500 ">
	Wickedblocks
	</h2>
	</a>
	<h1 class="mt-12 text-2xl font-semibold text-black tracking-ringtighter sm:text-3xl title-font">Log in to your
	account</h1>
	<form class="mt-6" action="#" method="POST">
	<div>
	<label class="block text-sm font-medium leading-relaxed tracking-tighter text-gray-700">Email
	Address</label>
	<input type="email" name="" id="" placeholder="Your Email "
	class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
	autofocus autocomplete required>
	</div>
	<div class="mt-4">
	<label class="block text-sm font-medium leading-relaxed tracking-tighter text-gray-700">Password</label>
	<input type="password" name="" id="" placeholder="Your Password" minlength="6"
	class="w-full px-4 py-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
	required>
	</div>
	<div class="mt-2 text-right">
	<a href="#"
	class="text-sm font-semibold leading-relaxed text-gray-700 hover:text-black focus:text-blue-700">Forgot
	Password?</a>
	</div>
	<button type="submit" class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 ">Log In</button>
	</form>
	<hr class="w-full my-6 border-gray-300">
	<div class="flex justify-enter">
	<button type="button"
	class="inline-flex w-full px-4 py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black hover:text-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ">
	<div class="flex items-center justify-center">
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	class="w-6 h-6" viewBox="0 0 48 48">
	<defs>
	<path id="a"
	d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
	</defs>
	<clipPath id="b">
	<use xlink:href="#a" overflow="visible" />
	</clipPath>
	<path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
	<path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
	<path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
	<path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
	</svg>
	<span class="ml-4">
	Log in with
	Google
	</span>
	</div>
	</button>
	<button type="button"
	class="inline-flex px-4 py-3 ml-8 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 hover:bg-black focus:bg-gray-100 hover:text-blue-500">
	<div class="flex items-center justify-center">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</div>
	</button>
	</div>
	<p class="mt-8 text-center">Need an account? <a href="#"
	class="font-semibold text-blue-500 hover:text-blue-700">Sign Up</a></p>
	</div>
	</div>
	</section>

	`,
	category: 'Authentication',
});


editor.BlockManager.add('landing-block-authentication-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/authentication/2.png"/>
	<div class="my-label-block">Authentication 2</div>
	</div>
	`,
	content: `
	<section class="flex flex-col items-center h-screen bg-gray-100 md:flex-row ">
	<div class="relative hidden w-full h-screen bg-gray-400 lg:block md:w-1/3 lg:w-2/3">
	<img src="https://dummyimage.com/600x500/F3F4F7/64748b" alt=""
	class="absolute object-cover w-full h-full">
	<div class="relative z-10 m-12 text-left">
	<a class="flex items-center w-32 mb-4 font-medium text-gray-900 title-font md:mb-10">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="text-lg font-bold tracking-tighter text-black uppercase duration-500 ease-in-out transform ttransition hover:text-lightBlue-500 ">
	Wickedblocks
	</h2>
	</a>
	<h1 class="mb-2 text-2xl font-semibold tracking-tighter text-black-700 tsm:text-5xl title-font">
	Discover 100+
	<br>
	screens ready to use.
	</h1>
	</div>
	</div>
	<div
	class="flex w-full h-screen px-6 bg-white md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12 items-left justify-left">
	<div class="w-full py-32 lg:py-6 lg:h-100">
	<h1 class="my-12 text-2xl font-semibold tracking-tighter text-black-700 sm:text-3xl title-font">Sign
	Up to a new
	world.</h1>
	<div class="flex justify-enter">
	<button type="button"
	class="inline-flex w-full px-4 py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black hover:text-white focus:bg-gray-100 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	<div class="flex items-center justify-center">
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" <svg
	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	class="w-6 h-6" viewBox="0 0 48 48">
	<defs>
	<path id="a"
	d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
	</defs>
	<clipPath id="b">
	<use xlink:href="#a" overflow="visible" />
	</clipPath>
	<path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
	<path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
	<path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
	<path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
	</svg>
	<span class="ml-4">
	Log in with
	Google
	</span>
	</div>
	</button>
	<button type="button"
	class="inline-flex px-4 py-3 ml-8 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black focus:bg-gray-100 hover:text-black-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	<div class="flex items-center justify-center">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</div>
	</button>
	</div>
	<form class="mt-6" action="#" method="POST">
	<div>
	<label
	class="block text-xs font-medium leading-relaxed tracking-tighter text-gray-700">Email
	Address</label>
	<input type="email" name="" id="" placeholder="Your Email "
	class="w-full px-4 py-2 mt-2 text-base transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg ext-black-700 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
	autofocus autocomplete required>
	</div>
	<div class="mt-4">
	<label
	class="block text-xs font-medium leading-relaxed tracking-tighter text-gray-700">Password</label>
	<input type="password" name="" id="" placeholder="Your Password" minlength="6"
	class="w-full px-4 py-2 text-base transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg ext-black-700 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2" required>
	</div>
	<div class="mt-2 text-right">
	<a href="#"
	class="text-sm font-semibold leading-relaxed text-gray-700 hover:text-black-700 focus:text-black-700">Forgot
	Password?</a>
	</div>
	<button type="submit"
	class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Log
	In</button>
	</form>
	<p class="mt-8 text-center">Need an account? <a href="#"
	class="font-semibold text-black-500 hover:text-black-400">Sign
	Up</a></p>
	</div>
	</div>
	</section>

	`,
	category: 'Authentication',
});


editor.BlockManager.add('landing-block-authentication-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/authentication/3.png"/>
	<div class="my-label-block">Authentication 3</div>
	</div>
	`,
	content: `
	<section class="flex flex-col items-center h-screen md:flex-row">
	<div class="container mx-auto">
	<div class="flex justify-center px-2 py-6 ">
	<div class="flex w-full rounded-lg xl:w-3/4 lg:w-11/12 lg:shadow-xl ">
	<div class="relative hidden w-full h-auto bg-white bg-cover border-r rounded-l-lg lg:block lg:w-6/12">
	<div class="relative z-10 m-12 text-left ">
	<a class="flex items-center w-32 mb-4 font-medium text-gray-900 title-font md:mb-10">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="text-lg font-bold tracking-tighter text-black uppercase transition duration-500 ease-in-out transform hover:text-lightBlack-500 ">
	Wickedblocks
	</h2>
	</a>
	<h2 class="mt-12 mb-2 text-2xl font-semibold tracking-tighter text-black sm:text-3xl title-font">
	Create an account.
	</h2>
	<div
	class="w-full mt-16 mb-8 text-base leading-relaxed text-gray-900 sm:md:w-3/3 lg:text-1xl ">
	All you have to do is choose the section you need, remove the one that you do not
	need for that project and paste
	the one you need in that moment. All the section have been given the same left/right
	padding. Because consistence is
	king.
	</div>
	</div>
	</div>
	<div
	class="w-full px-8 py-24 bg-white border-gray-100 rounded-lg lg:w-8/12 lg:px-24 lg:py-4 lg:rounded-l-none s">
	<div class="relative z-10 text-left ">
	<div class="flex justify-enter lg:py-6">
	<button type="button"
	class="inline-flex w-full px-4 py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black hover:text-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	<div class="flex items-center justify-center">
	<svg xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink" class="w-6 h-6"
	viewBox="0 0 48 48">
	<defs>
	<path id="a"
	d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
	</defs>
	<clipPath id="b">
	<use xlink:href="#a" overflow="visible" />
	</clipPath>
	<path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
	<path clip-path="url(#b)" fill="#EA4335"
	d="M0 11l17 13 7-6.1L48 14V0H0z" />
	<path clip-path="url(#b)" fill="#34A853"
	d="M0 37l30-23 7.9 1L48 0v48H0z" />
	<path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
	</svg>
	<span class="ml-4">
	Log in with
	Google
	</span>
	</div>
	</button>
	<button type="button"
	class="inline-flex px-4 py-3 ml-8 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black focus:bg-gray-100 hover:text-black focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	<div class="flex items-center justify-center">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round"
	stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</div>
	</button>
	</div>
	<form class="mt-6" action="#" method="POST">
	<div>
	<label class="block text-base font-medium leading-relaxed text-gray-700">User
	Name</label>
	<input type="text" name="" id="" placeholder="Your User Name "
	class="w-full px-4 py-2 mt-2 text-base transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ext-black focus:border-gray-500"
	autofocus autocomplete required>
	</div>
	<div class="mt-4">
	<label class="block text-base font-medium leading-relaxed text-gray-700">Email
	Address</label>
	<input type="email" name="" id="" placeholder="Your Email "
	class="w-full px-4 py-2 mt-2 text-base transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ext-black focus:border-gray-500"
	autofocus autocomplete required>
	</div>
	<div class="flex flex-wrap mt-4 mb-6 -mx-3">
	<div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
	<label class="text-base font-medium leading-relaxed text-gray-700"
	for="password" minlength="6">
		Password
	</label>
	<input
	class="block w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ext-black focus:border-gray-500"
	id="password" type="text" placeholder="Your Password">
	<p class="mt-1 text-xs italic text-black">Please fill out this field.</p>
	</div>
	<div class="w-full px-3 md:w-1/2">
	<label class="text-base font-medium leading-relaxed text-gray-700"
	for="confirm">
		Confirm
	</label>
	<input
	class="block w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ext-black focus:border-gray-500 "
	id="confirm" type="text" placeholder="Confirm">
	</div>
	</div>
	<button type="submit" class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform rounded-lg bg-gradient-to-r from-black hover:from-black to-black focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 hover:to-black">Log In</button>
	</form>
	<p class="mt-8 text-center">Already have an account? <a href="#"
	class="font-semibold text-black hover:text-black">Sign
	In</a></p>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section> 

	`,
	category: 'Authentication',
});





















/////////////////////////
// PRICING
//////////////////////

editor.BlockManager.add('landing-block-pricing-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/1.png"/>
	<div class="my-label-block">Pricing 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-24 mx-auto lg:px-4">
	<div class="flex flex-wrap text-center">
	<div class="px-8 py-6 mx-auto lg:px-24 lg:w-2/4 md:w-full">
	<div
	class="flex flex-col items-center justify-center h-full px-4 py-6 text-center shadow-xl rounded-xl">
	<h2
	class="flex items-baseline justify-center mt-2 text-3xl font-bold leading-none text-black lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!..</p>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});

editor.BlockManager.add('landing-block-pricing-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/2.png"/>
	<div class="my-label-block">Pricing 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-24 mx-auto lg:px-4">
	<div class="flex flex-wrap text-center">
	<div class="px-8 py-6 mx-auto lg:px-24 lg:w-2/4 md:w-full">
	<div class="flex flex-col items-center justify-center h-full px-4 py-6 text-center shadow-xl rounded-xl">
	<h2 class="flex items-baseline justify-center mt-2 text-3xl font-bold leading-none text-black lg:text-6xl">
	$0
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!..</p>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	<div class="px-8 py-6 mx-auto lg:px-24 lg:w-2/4 md:w-full">
	<div class="flex flex-col items-center justify-center h-full px-4 py-6 text-center shadow-xl rounded-xl">
	<h2 class="flex items-baseline justify-center mt-2 text-3xl font-bold leading-none text-black lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!..</p>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});

editor.BlockManager.add('landing-block-pricing-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/3.png"/>
	<div class="my-label-block">Pricing 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-20 mx-auto ">
	<div class="flex flex-wrap text-center lg:divide-x">
	<div class="w-full px-8 py-6 mx-auto lg:w-1/3">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> User 1
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">START</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-black lg:text-6xl">
	$8
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	<div class="w-full px-8 py-6 mx-auto lg:w-1/3">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> User 2
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">START</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-black lg:text-6xl">
	$16
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	<div class="w-full px-8 py-6 mx-auto lg:w-1/3">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> User 3
	</h2>
	<p class="my-4 text-base leading-relaxed ">
	Use the free templates for free with your whole team. Upgrade to pro to get life support
	and
	1 year updates or get the whole package delivered to your email instantly and start
	integrating!.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">PRO</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-black lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="flex items-center px-8 py-3 mx-auto mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});

editor.BlockManager.add('landing-block-pricing-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/4.png"/>
	<div class="my-label-block">Pricing 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-8 mx-auto lg:px-20">
	<div class="flex flex-wrap ">
	<div class="px-8 py-6 mx-auto lg:px-10 lg:w-1/2 md:w-full">
	<div class="h-full px-4 py-6 border rounded-xl">
	<svg class="w-10 h-10 mb-4 ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="34" height="24" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M5.68 7.314l-1.82 5.914L12 19.442l8.14-6.214-1.82-5.914L16.643 11H7.356L5.681 7.314zM15.357 9l2.888-6.354a.4.4 0 0 1 .747.048l3.367 10.945a.5.5 0 0 1-.174.544L12 21.958 1.816 14.183a.5.5 0 0 1-.174-.544L5.009 2.694a.4.4 0 0 1 .747-.048L8.644 9h6.712z" />
	</svg>
	<h3 class="tracking-widest">START</h3>
	<h2
	class="flex items-center justify-start mt-2 mb-4 text-3xl font-bold leading-none text-left text-black lg:text-6xl">
	$8
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<p class="mb-4 text-base leading-relaxed">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.</p>
	<p class="flex items-center mb-2 text-gray-600">
	<span
	class="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 text-white bg-gray-500 rounded-full">
	<svg fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Feature 1
	</p>
	<p class="flex items-center mb-20 text-gray-600">
	<span
	class="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 text-white bg-gray-500 rounded-full">
	<svg fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Feature 2
	</p>
	<button
	class="items-end w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	<div class="px-8 py-6 mx-auto lg:px-10 lg:w-1/2 md:w-full">
	<div class="h-full px-4 py-6 border rounded-xl">
	<svg class="w-10 h-10 mb-4 ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
	width="18" height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	<h3 class="tracking-widest">PRO</h3>
	<h2
	class="flex items-center justify-start mt-2 mb-4 text-3xl font-bold leading-none text-left text-black lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<p class="mb-4 text-base leading-relaxed">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.</p>
	<p class="flex items-center mb-2 text-gray-600">
	<span
	class="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 text-white bg-gray-500 rounded-full">
	<svg fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Feature 1
	</p>
	<p class="flex items-center mb-2 text-gray-600">
	<span
	class="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 text-white bg-gray-500 rounded-full">
	<svg fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Feature 2
	</p>
	<p class="flex items-center mb-6 text-gray-600">
	<span
	class="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 mr-2 text-white bg-gray-500 rounded-full">
	<svg fill="none" stroke="currentColor" stroke-linecap="round"
	stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Feature 3
	</p>
	<button
	class="w-full px-8 py-3 mx-auto mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});

editor.BlockManager.add('landing-block-pricing-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/5.png"/>
	<div class="my-label-block">Pricing 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-2 mx-auto">
	<div class="flex flex-wrap ">
	<div class="px-2 py-2 lg:w-1/3 md:w-full">
	<div class="border rounded-xl">
	<img class="object-cover object-center w-full mb-2 h-52 rounded-t-xl"
	src="https://dummyimage.com/420x200/E2E8F0/ffffff" alt="content">
	<div class="p-6 ">
	<h2
	class="flex items-baseline justify-start mb-4 text-3xl font-bold leading-none text-left text-black lg:text-6xl">
	$8
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Bundle
	1
	</h2>
	<p class="mb-4 text-base leading-relaxed">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.</p>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</div>
	</div>
	<div class="px-2 py-2 lg:w-1/3 md:w-full">
	<div class="border rounded-xl">
	<img class="object-cover object-center w-full mb-2 h-52 rounded-t-xl"
	src="https://dummyimage.com/420x200/E2E8F0/ffffff" alt="content">
	<div class="p-6 ">
	<h2
	class="flex items-baseline justify-start mb-4 text-3xl font-bold leading-none text-left text-black lg:text-6xl">
	$18
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Bundle
	2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.</p>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</div>
	</div>
	<div class="px-2 py-2 lg:w-1/3 md:w-full">
	<div class="border rounded-xl">
	<img class="object-cover object-center w-full mb-2 h-52 rounded-t-xl"
	src="https://dummyimage.com/420x200/E2E8F0/ffffff" alt="content">
	<div class="p-6 ">
	<h2
	class="flex items-baseline justify-start mb-4 text-3xl font-bold leading-none text-left text-black lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Bundle
	3
	</h2>
	<p class="mb-4 text-base leading-relaxed">Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal
	use.</p>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});

editor.BlockManager.add('landing-block-pricing-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/6.png"/>
	<div class="my-label-block">Pricing 6</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-20 mx-auto lg:px-4">
	<div class="flex flex-wrap text-center">
	<div class="px-2 py-6 mx-auto lg:w-1/4 md:w-full">
	<div class="p-4 border rounded-xl">
	<h2 class="mb-3 text-lg font-bold text-blue-700 lg:text-4xl title-font"> User 1
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">BEGGINER</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-blue-800 lg:text-6xl">
	$0
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	<div class="px-2 py-6 mx-auto lg:w-1/4 md:w-full">
	<div class="p-4 border rounded-xl">

	<h2 class="mb-3 text-lg font-bold text-blue-700 lg:text-4xl title-font"> User 2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">HOBBY</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-blue-800 lg:text-6xl">
	$6
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	<div class="px-2 py-6 mx-auto lg:w-1/4 md:w-full">
	<div class="p-4 border rounded-xl">

	<h2 class="mb-3 text-lg font-bold text-blue-700 lg:text-4xl title-font"> User 3
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">STARTUP</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-blue-800 lg:text-6xl">
	$28
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	<div class="px-2 py-6 mx-auto lg:w-1/4 md:w-full">
	<div class="p-4 border rounded-xl">

	<h2 class="mb-3 text-lg font-bold text-blue-700 lg:text-4xl title-font"> User 4
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<div class="flex flex-col items-center justify-center px-2 text-center lg:h-32">
	<h3 class="tracking-widest">CORPORATE</h3>
	<h2
	class="flex items-center justify-center mt-2 mb-4 text-3xl font-bold leading-none text-blue-800 lg:text-6xl">
	$38
	<span class="ml-1 text-base text-gray-600">/mo</span>
	</h2>
	</div>
	<button
	class="w-full px-8 py-3 mx-auto font-semibold text-black transition duration-500 ease-in-out transform bg-white border rounded-lg hover:bg-gray-200 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
	Action
	</button>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});





editor.BlockManager.add('landing-block-pricing-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/7.png"/>
	<div class="my-label-block">Pricing 7</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font overflow-hidden">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Pricing</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical.</p>
	<div class="flex mx-auto border-2 border-indigo-500 rounded overflow-hidden mt-6">
	<button class="py-1 px-4 bg-indigo-500 text-white focus:outline-none">Monthly</button>
	<button class="py-1 px-4 focus:outline-none">Annually</button>
	</div>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="p-4 xl:w-1/4 md:w-1/2 w-full">
	<div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
	<h2 class="text-sm tracking-widest title-font mb-1 font-medium">START</h2>
	<h1 class="text-5xl text-gray-900 pb-4 mb-4 border-b border-gray-200 leading-none">Free</h1>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Tumeric plaid portland
	</p>
	<p class="flex items-center text-gray-600 mb-6">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Mixtape chillwave tumeric
	</p>
	<button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	<p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
	</div>
	</div>
	<div class="p-4 xl:w-1/4 md:w-1/2 w-full">
	<div class="h-full p-6 rounded-lg border-2 border-indigo-500 flex flex-col relative overflow-hidden">
	<span class="bg-indigo-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
	<h2 class="text-sm tracking-widest title-font mb-1 font-medium">PRO</h2>
	<h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
	<span>$38</span>
	<span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
	</h1>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Tumeric plaid portland
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Hexagon neutra unicorn
	</p>
	<p class="flex items-center text-gray-600 mb-6">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Mixtape chillwave tumeric
	</p>
	<button class="flex items-center mt-auto text-white bg-indigo-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	<p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
	</div>
	</div>
	<div class="p-4 xl:w-1/4 md:w-1/2 w-full">
	<div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
	<h2 class="text-sm tracking-widest title-font mb-1 font-medium">BUSINESS</h2>
	<h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
	<span>$56</span>
	<span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
	</h1>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Tumeric plaid portland
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Hexagon neutra unicorn
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-6">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Mixtape chillwave tumeric
	</p>
	<button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	<p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
	</div>
	</div>
	<div class="p-4 xl:w-1/4 md:w-1/2 w-full">
	<div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
	<h2 class="text-sm tracking-widest title-font mb-1 font-medium">SPECIAL</h2>
	<h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
	<span>$72</span>
	<span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
	</h1>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Tumeric plaid portland
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Hexagon neutra unicorn
	</p>
	<p class="flex items-center text-gray-600 mb-2">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Vexillologist pitchfork
	</p>
	<p class="flex items-center text-gray-600 mb-6">
	<span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
	<path d="M20 6L9 17l-5-5"></path>
	</svg>
	</span>Mixtape chillwave tumeric
	</p>
	<button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	<p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});


editor.BlockManager.add('landing-block-pricing-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/pricing/8.png"/>
	<div class="my-label-block">Pricing 8</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Pricing</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Banh mi cornhole echo park skateboard authentic crucifix neutra tilde lyft biodiesel artisan direct trade mumblecore 3 wolf moon twee</p>
	</div>
	<div class="lg:w-2/3 w-full mx-auto overflow-auto">
	<table class="table-auto w-full text-left whitespace-no-wrap">
	<thead>
	<tr>
	<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
	<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Speed</th>
	<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Storage</th>
	<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
	<th class="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
	</tr>
	</thead>
	<tbody>
	<tr>
	<td class="px-4 py-3">Start</td>
	<td class="px-4 py-3">5 Mb/s</td>
	<td class="px-4 py-3">15 GB</td>
	<td class="px-4 py-3 text-lg text-gray-900">Free</td>
	<td class="w-10 text-center">
	<input name="plan" type="radio">
	</td>
	</tr>
	<tr>
	<td class="border-t-2 border-gray-200 px-4 py-3">Pro</td>
	<td class="border-t-2 border-gray-200 px-4 py-3">25 Mb/s</td>
	<td class="border-t-2 border-gray-200 px-4 py-3">25 GB</td>
	<td class="border-t-2 border-gray-200 px-4 py-3 text-lg text-gray-900">$24</td>
	<td class="border-t-2 border-gray-200 w-10 text-center">
	<input name="plan" type="radio">
	</td>
	</tr>
	<tr>
	<td class="border-t-2 border-gray-200 px-4 py-3">Business</td>
	<td class="border-t-2 border-gray-200 px-4 py-3">36 Mb/s</td>
	<td class="border-t-2 border-gray-200 px-4 py-3">40 GB</td>
	<td class="border-t-2 border-gray-200 px-4 py-3 text-lg text-gray-900">$50</td>
	<td class="border-t-2 border-gray-200 w-10 text-center">
	<input name="plan" type="radio">
	</td>
	</tr>
	<tr>
	<td class="border-t-2 border-b-2 border-gray-200 px-4 py-3">Exclusive</td>
	<td class="border-t-2 border-b-2 border-gray-200 px-4 py-3">48 Mb/s</td>
	<td class="border-t-2 border-b-2 border-gray-200 px-4 py-3">120 GB</td>
	<td class="border-t-2 border-b-2 border-gray-200 px-4 py-3 text-lg text-gray-900">$72</td>
	<td class="border-t-2 border-b-2 border-gray-200 w-10 text-center">
	<input name="plan" type="radio">
	</td>
	</tr>
	</tbody>
	</table>
	</div>
	<div class="flex pl-4 mt-4 lg:w-2/3 w-full mx-auto">
	<a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	</div>
	</div>
	</section>

	`,
	category: 'Pricing',
});





























/////////////////////////////////////////
//  Clients
/////////////////////////////////////////

editor.BlockManager.add('landing-block-сlients-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/сlients/1.png"/>
	<div class="my-label-block">Clients 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pb-24 mx-auto pt-36 lg:px-4">
	<div class="flex flex-wrap -m-4">
	<div class="p-4 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-center">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-20 h-20 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff">
	<p class="text-base font-medium leading-relaxed text-gray-700">Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble
	griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose
	blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah.</p>
	<h2 class="mt-12 text-sm font-medium tracking-wider text-gray-900 title-font">Mike Vega</h2>
	<p class="text-gray-500">CE0  </p>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Clients',
});

editor.BlockManager.add('landing-block-сlients-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/сlients/2.png"/>
	<div class="my-label-block">Clients 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container flex flex-col items-center px-5 py-16 mx-auto lg:px-20 lg:py-36 md:flex-row">
	<div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
	<img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x400/94a3b8/ffffff">
	</div>
	<div
	class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
	<p class="mb-2 text-base leading-relaxed text-center text-gray-700 lg:text-left lg:text-xl">
	"Tailwind CSS templates
	with a wicked design.
	Professionally designed and 100% responsive static templates for startups and personal use.Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble
	griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose
	blunt."</p>
	<h2 class="my-6 text-sm font-medium tracking-wider text-gray-900 title-font">Mike Vega
	<span class="text-gray-500">CE0 </span>
	</h2>
	<div class="flex ">
	<a href="#slide1" class="w-4 h-4 mx-1 bg-gray-400 rounded-full"></a>
	<a href="#slide2" class="w-4 h-4 mx-1 bg-gray-400 rounded-full"></a>
	<a href="#slide3" class="w-4 h-4 mx-1 bg-gray-400 rounded-full"></a>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Clients',
});

editor.BlockManager.add('landing-block-сlients-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/сlients/3.png"/>
	<div class="my-label-block">Clients 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 pb-24 mx-auto lg:px-4">
	<div class="flex flex-wrap -m-4">
	<div class="p-4 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-left">
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah. ".</p>
	<a class="inline-flex items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-20 h-20 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff"> <span
	class="flex flex-col flex-grow pl-4">
	<span class="font-medium text-gray-900 title-font">Adi Pio</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</a>
	</div>
	</div>
	<div class="p-4 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-left">
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah. ".</p>
	<a class="inline-flex items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-20 h-20 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff"> <span
	class="flex flex-col flex-grow pl-4">
	<span class="font-medium text-gray-900 title-font">Anna Schönn</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Clients',
});

editor.BlockManager.add('landing-block-сlients-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/сlients/4.png"/>
	<div class="my-label-block">Clients 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 pb-24 mx-auto lg:px-4">
	<div class="flex flex-wrap -m-4">
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-left">
	<a class="inline-flex items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff"> <span
	class="flex flex-col flex-grow pl-4">
	<span class="font-medium text-gray-900 title-font">Adi Pio</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</a>
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant.".</p>
	</div>
	</div>
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-left">
	<a class="inline-flex items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff"> <span
	class="flex flex-col flex-grow pl-4">
	<span class="font-medium text-gray-900 title-font">Anna Schönn</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</a>
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant.".</p>
	</div>
	</div>
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full text-left">
	<a class="inline-flex items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-8 bg-gray-100 rounded-full"
	src="https://dummyimage.com/302x302/94a3b8/ffffff"> <span class="flex flex-col flex-grow pl-4">
	<span class="font-medium text-gray-900 title-font">Jakko Svensson</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</a>
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant.".</p>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Clients',
});

editor.BlockManager.add('landing-block-сlients-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/сlients/5.png"/>
	<div class="my-label-block">Clients 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pb-24 mx-auto pt-36 lg:px-4">
	<div class="flex flex-wrap -m-4">
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full p-4 text-left border rounded-xl">
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah. ".</p>
	<a class="flex flex-wrap items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-4 rounded-full bg-4gray-100"
	src="https://dummyimage.com/302x302/94a3b8/ffffff">
	</a>
	<span class="flex flex-col flex-grow ">
	<span class="font-medium text-gray-900 title-font">Jakko Svensson</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</div>
	</div>
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full p-4 text-left border rounded-xl">
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah. ".</p>
	<a class="flex flex-wrap items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-4 rounded-full bg-4gray-100"
	src="https://dummyimage.com/302x302/94a3b8/ffffff">
	</a>
	<span class="flex flex-col flex-grow ">
	<span class="font-medium text-gray-900 title-font">Mike Taissöön</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</div>
	</div>
	<div class="p-8 mx-auto mb-6 lg:w-1/3 lg:mb-0">
	<div class="h-full p-4 text-left border rounded-xl">
	<p class="text-base font-medium leading-relaxed text-gray-700">"Skate ipsum dolor sit amet, slam birdie wheels ollie darkslide egg plant. Baseplate 540 helipop flypaper feeble griptape. Nollie deck street bluntslide half-cab yeah. Casper slide ollie north 540 Bill Danforth slide cess slide nose blunt. Pressure flip Streetstyle in Tempe mute-air judo air backside fastplant yeah. ".</p>
	<a class="flex flex-wrap items-center mt-6">
	<img alt="testimonial"
	class="inline-block object-cover object-center w-16 h-16 mb-4 rounded-full bg-4gray-100"
	src="https://dummyimage.com/302x302/94a3b8/ffffff">
	</a>
	<span class="flex flex-col flex-grow ">
	<span class="font-medium text-gray-900 title-font">Sanna Ristola</span>
	<span class="text-sm text-gray-500 uppercase">Corporate Position</span>
	</span>
	</div>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Clients',
});































//////////////////////////////////////
//  GRIDS
//////////////////////////////////////


editor.BlockManager.add('landing-block-grid-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/1.png"/>
	<div class="my-label-block">Grids 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 pb-24 mx-auto lg:px-4">
	<div class="flex flex-wrap text-center">
	<div class="px-8 py-6 lg:px-24 lg:w-2/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 1</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:px-24 lg:w-2/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 2</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});

editor.BlockManager.add('landing-block-grid-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/2.png"/>
	<div class="my-label-block">Grids 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 mx-auto lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 md:w-full lg:w-1/3 ">
	<div class="flex items-center mb-3">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 mr-3 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font">Longer
	Information 1
	</h2>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<div class="flex items-center mb-3">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 mr-3 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font">Longer
	Information 2
	</h2>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<div class="flex items-center mb-3">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 mr-3 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font">Longer
	Information 3
	</h2>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Learn More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});
editor.BlockManager.add('landing-block-grid-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/3.png"/>
	<div class="my-label-block">Grids 3</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 pb-24 mx-auto lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 1</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 2</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM11 13H4v6h7v-6zm9 0h-7v6h7v-6zm-9-8H4v6h7V5zm9 0h-7v6h7V5z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 3</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<div
	class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mb-5 text-blue-800 bg-gray-200 rounded-full">
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
	height="18" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
	</svg>
	</div>
	<h2 class="mb-3 text-lg font-medium text-gray-700 title-font">Information 4</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});
editor.BlockManager.add('landing-block-grid-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/4.png"/>
	<div class="my-label-block">Grids 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto py-36 lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded" src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 1
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded" src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded" src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});
editor.BlockManager.add('landing-block-grid-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/5.png"/>
	<div class="my-label-block">Grids 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto py-36 lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<div class="flex items-center justify-between ">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 1
	</h2>
	<span class="mb-1 text-xs font-medium tracking-widest text-blue-500 title-font">Your
	tagline</span>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<div class="flex items-center justify-between ">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 2
	</h2>
	<span class="mb-1 text-xs font-medium tracking-widest text-blue-500 title-font">Your
	tagline</span>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<div class="flex items-center justify-between ">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 3
	</h2>
	<span class="mb-1 text-xs font-medium tracking-widest text-blue-500 title-font">Your
	tagline</span>
	</div>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});
editor.BlockManager.add('landing-block-grid-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/6.png"/>
	<div class="my-label-block">Grids 6</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 mx-auto py-36 lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 1
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/F3F4F7/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 3
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	<div class="px-8 py-6 lg:w-1/4 md:w-full">
	<img class="object-cover object-center w-full h-40 mb-6 rounded" src="https://dummyimage.com/720x400/F3F4F7/8693ac"
	alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 4
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});
editor.BlockManager.add('landing-block-grid-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/7.png"/>
	<div class="my-label-block">Grids 7</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-24 mx-auto lg:px-4">
	<div class="flex flex-wrap text-left">
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<div class="p-6 rounded-md bg-blueGray-200">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/ffffff/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 1
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#"
	class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
	height="20" fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
	d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<div class="p-6 rounded-md bg-blueGray-200">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/ffffff/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 2
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	<div class="px-8 py-6 lg:w-1/3 md:w-full">
	<div class="p-6 rounded-md bg-blueGray-200">
	<img class="object-cover object-center w-full h-40 mb-6 rounded"
	src="https://dummyimage.com/720x400/ffffff/8693ac" alt="content">
	<h2 class="mb-3 text-lg font-semibold text-gray-700 lg:text-2xl title-font"> Information 3
	</h2>
	<p class="mb-4 text-base leading-relaxed">Fingerstache flexitarian street art 8-bit waistcoat.
	Distillery
	hexagon disrupt edison bulbche.</p>
	<a href="#" class="inline-flex items-center font-semibold text-blue-700 md:mb-2 lg:mb-0 hover:text-blue-400 ">
	Read More
	<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
	fill="currentColor">
	<path fill="none" d="M0 0h24v24H0z" />
	<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});


editor.BlockManager.add('landing-block-grid-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/8.png"/>
	<div class="my-label-block">Blog Grids 8</div>
	</div>
	`,
	content: `
	
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4">
	<div class="p-4 md:w-1/3">
	<div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
	<img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="blog">
	<div class="p-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">The Catalyzer</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<div class="flex items-center flex-wrap ">
	<a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	</div>
	<div class="p-4 md:w-1/3">
	<div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
	<img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/721x401" alt="blog">
	<div class="p-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">The 400 Blows</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<div class="flex items-center flex-wrap">
	<a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	</div>
	<div class="p-4 md:w-1/3">
	<div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
	<img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/722x402" alt="blog">
	<div class="p-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">Shooting Stars</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<div class="flex items-center flex-wrap ">
	<a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});



editor.BlockManager.add('landing-block-grid-9', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/9.png"/>
	<div class="my-label-block">Blog Grids 9</div>
	</div>
	`,
	content: `
	
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4">
	<div class="p-4 lg:w-1/3">
	<div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Raclette Blueberry Nextious Level</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
	<span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/3">
	<div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Ennui Snackwave Thundercats</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
	<span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	<div class="p-4 lg:w-1/3">
	<div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
	<h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
	<h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Selvage Poke Waistcoat Godard</h1>
	<p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
	<span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});

editor.BlockManager.add('landing-block-grid-10', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/10.png"/>
	<div class="my-label-block">Blog Grids 10</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font overflow-hidden">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-12">
	<div class="p-12 md:w-1/2 flex flex-col items-start">
	<span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">CATEGORY</span>
	<h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">Roof party normcore before they sold out, cornhole vape</h2>
	<p class="leading-relaxed mb-8">Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia unicorn. Plaid fixie chambray 90's, slow-carb etsy tumeric. Cray pug you probably haven't heard of them hexagon kickstarter craft beer pork chic.</p>
	<div class="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<span class="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	<a class="inline-flex items-center">
	<img alt="blog" src="https://dummyimage.com/104x104" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-4">
	<span class="title-font font-medium text-gray-900">Holden Caulfield</span>
	<span class="text-gray-400 text-xs tracking-widest mt-0.5">UI DEVELOPER</span>
	</span>
	</a>
	</div>
	<div class="p-12 md:w-1/2 flex flex-col items-start">
	<span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">CATEGORY</span>
	<h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">Pinterest DIY dreamcatcher gentrify single-origin coffee</h2>
	<p class="leading-relaxed mb-8">Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia unicorn. Plaid fixie chambray 90's, slow-carb etsy tumeric.</p>
	<div class="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
	<a class="text-indigo-500 inline-flex items-center">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	<span class="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	</svg>1.2K
	</span>
	<span class="text-gray-400 inline-flex items-center leading-none text-sm">
	<svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>6
	</span>
	</div>
	<a class="inline-flex items-center">
	<img alt="blog" src="https://dummyimage.com/103x103" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-4">
	<span class="title-font font-medium text-gray-900">Alper Kamu</span>
	<span class="text-gray-400 text-xs tracking-widest mt-0.5">DESIGNER</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	</section>	

	`,
	category: 'Grids',
});

editor.BlockManager.add('landing-block-grid-11', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/11.png"/>
	<div class="my-label-block">Blog Grids 11</div>
	</div>
	`,
	content: `
	
	<section class="text-gray-600 body-font overflow-hidden">
	<div class="container px-5 py-24 mx-auto">
	<div class="-my-8 divide-y-2 divide-gray-100">
	<div class="py-8 flex flex-wrap md:flex-nowrap">
	<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
	<span class="font-semibold title-font text-gray-700">CATEGORY</span>
	<span class="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
	</div>
	<div class="md:flex-grow">
	<h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Bitters hashtag waistcoat fashion axe chia unicorn</h2>
	<p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
	<a class="text-indigo-500 inline-flex items-center mt-4">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="py-8 flex flex-wrap md:flex-nowrap">
	<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
	<span class="font-semibold title-font text-gray-700">CATEGORY</span>
	<span class="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
	</div>
	<div class="md:flex-grow">
	<h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Meditation bushwick direct trade taxidermy shaman</h2>
	<p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
	<a class="text-indigo-500 inline-flex items-center mt-4">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="py-8 flex flex-wrap md:flex-nowrap">
	<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
	<span class="font-semibold title-font text-gray-700">CATEGORY</span>
	<span class="text-sm text-gray-500">12 Jun 2019</span>
	</div>
	<div class="md:flex-grow">
	<h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Woke master cleanse drinking vinegar salvia</h2>
	<p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
	<a class="text-indigo-500 inline-flex items-center mt-4">Learn More
	<svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
	<path d="M5 12h14"></path>
	<path d="M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});

editor.BlockManager.add('landing-block-grid-12', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/grids/12.png"/>
	<div class="my-label-block">Blog Grids 12</div>
	</div>
	`,
	content: `
	
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -mx-4 -my-8">
	<div class="py-8 px-4 lg:w-1/3">
	<div class="h-full flex items-start">
	<div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
	<span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
	<span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
	<h1 class="title-font text-xl font-medium text-gray-900 mb-3">The 400 Blows</h1>
	<p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="inline-flex items-center">
	<img alt="blog" src="https://dummyimage.com/103x103" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-3">
	<span class="title-font font-medium text-gray-900">Alper Kamu</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	<div class="py-8 px-4 lg:w-1/3">
	<div class="h-full flex items-start">
	<div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
	<span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
	<span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
	<h1 class="title-font text-xl font-medium text-gray-900 mb-3">Shooting Stars</h1>
	<p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="inline-flex items-center">
	<img alt="blog" src="https://dummyimage.com/102x102" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-3">
	<span class="title-font font-medium text-gray-900">Holden Caulfield</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	<div class="py-8 px-4 lg:w-1/3">
	<div class="h-full flex items-start">
	<div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
	<span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
	<span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
	</div>
	<div class="flex-grow pl-6">
	<h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
	<h1 class="title-font text-xl font-medium text-gray-900 mb-3">Neptune</h1>
	<p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	<a class="inline-flex items-center">
	<img alt="blog" src="https://dummyimage.com/101x101" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
	<span class="flex-grow flex flex-col pl-3">
	<span class="title-font font-medium text-gray-900">Henry Letham</span>
	</span>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Grids',
});




// editor.BlockManager.add('landing-block-grid-7', {
// 	label: `
// 	<div>
// 	<img src="` + path + `/images/grids/7.png"/>
// 	<div class="my-label-block">Grids 7</div>
// 	</div>
// 	`,
// 	content: `


// 	`,
// 	category: 'Grids',
// });














/////////////////////////////////
//   FORMS
/////////////////////////////////



editor.BlockManager.add('landing-block-forms-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/1.png"/>
	<div class="my-label-block">Form 1</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-48 pb-24 mx-auto lg:px-4">
	<div
	class="flex flex-col w-full p-8 mx-auto mt-10 border rounded-lg lg:w-2/6 md:w-1/2 md:ml-auto md:mt-0">
	<div class="relative ">
	<input type="email" id="email" name="email" placeholder="Password"
	class="w-full px-4 py-2 mb-4 text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg mr-4text-base focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	</div>
	<div class="relative ">
	<input type="email" id="email" name="email" placeholder="email"
	class="w-full px-4 py-2 mb-4 text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg mr-4text-base focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	</div>
	<div class="flex my-4">
	<label class="flex items-center">
	<input type="checkbox" class="form-checkbox">
	<span class="ml-2">Subscribe me </span>
	</label>
	</div>
	<button
	class="px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	<p class="mx-auto mt-3 text-xs text-gray-500">Literally you probably haven't heard of them jean
	shorts.</p>
	</div>
	</div>
	</section>

	`,
	category: 'Forms',
});

editor.BlockManager.add('landing-block-forms-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/2.png"/>
	<div class="my-label-block">Form 2</div>
	</div>
	`,
	content: `
	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-24 pb-24 mx-auto lg:px-4">
	<div
	class="flex flex-col w-full p-8 mx-auto mt-10 border rounded-lg lg:w-2/6 md:w-1/2 md:ml-auto md:mt-0">
	<div class="flex flex-wrap -m-2">
	<div class="w-1/2 p-2">
	<div class="relative">
	<input type="text" id="name" name="name" placeholder="name"
	class="w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	</div>
	<div class="w-1/2 p-2">
	<div class="relative">
	<input type="name" id="name" name="name" placeholder="name"
	class="w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	</div>
	<div class="w-full p-2">
	<input type="email" id="email" name="email" placeholder="email"
	class="w-full px-4 py-2 mr-4 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	<div class="w-full p-2">
	<input type="password" id="password" name="password" placeholder="password"
	class="w-full px-4 py-2 mr-4 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	<div class="w-full p-2">
	<input type="password" id="password" name="password" placeholder=" password"
	class="w-full px-4 py-2 mr-4 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	<div class="flex p-2">
	<label class="flex items-center">
	<input type="checkbox" class="rounded form-checkbox">
	<span class="ml-2">Subscribe me </span>
	</label>
	</div>
	<div class="w-full p-2">
	<input type="password" id="password" name="password" placeholder="password"
	class="w-full px-4 py-2 mr-4 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	</div>
	<div class="w-full p-2 ">
	<button
	class="w-full px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	<p class="mx-auto mt-3 text-xs text-center text-gray-500">WickedTemplates rocks, and you know it.</p>
	</div>
	</div>
	</div>
	</section>

	`,
	category: 'Forms',
});
editor.BlockManager.add('landing-block-forms-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/3.png"/>
	<div class="my-label-block">Form 3</div>
	</div>
	`,
	content: `

	<section class="text-gray-700 body-font">
	<div class="container px-8 pt-24 pb-24 mx-auto lg:px-4">
	<div
	class="flex flex-col w-full p-8 mx-auto mt-10 border rounded-lg lg:w-2/6 md:w-1/2 md:ml-auto md:mt-0">
	<div class="relative ">
	<label for="email" class="text-sm leading-7 text-gray-600">Email</label>
	<input type="email" id="v" name="email" placeholder="email"
	class="w-full px-4 py-2 mb-4 text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg mr-4text-base focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	</div>
	<div class="relative ">
	<label for="name" class="text-sm leading-7 text-gray-600">Name</label>
	<input type="name" id="name" name="name" placeholder="name"
	class="w-full px-4 py-2 mb-4 text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg mr-4text-base focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
	</div>
	<div class="relative mb-4 ">
	<label class="block ">
	<label for="email" class="text-sm leading-7 text-gray-600">Choose</label>
	<select
	class="block w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
	<option>Corporate event</option>
	<option>Wedding</option>
	<option>Birthday</option>
	<option>Other</option>
	</select>
	</label>
	</div>
	<div class="relative ">
	<textarea type="message" id="message" name="message" placeholder="message"
	class="w-full px-4 py-2 mb-4 text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg mr-4text-base focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"></textarea>
	</div>
	<button
	class="px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-gray-800 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">Button</button>
	</div>
	</div>
	</section>

	`,
	category: 'Forms',
});



editor.BlockManager.add('landing-block-forms-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/4.png"/>
	<div class="my-label-block">Form 4</div>
	</div>
	`,
	content: `

	<section class="text-gray-600 body-font relative">
	<div class="absolute inset-0 bg-gray-300">
	<iframe width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" title="map" scrolling="no" src="https://maps.google.com/maps?&height=600&hl=en&q=%C4%B0zmir+(My%20Business%20Name)&ie=UTF8&t=&z=14&iwloc=B&output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe>
	</div>
	<div class="container px-5 py-24 mx-auto flex">
	<div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
	<h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
	<p class="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p>
	<div class="relative mb-4">
	<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
	<input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<div class="relative mb-4">
	<label for="message" class="leading-7 text-sm text-gray-600">Message</label>
	<textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
	</div>
	<button class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<p class="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
	</div>
	</div>
	</section>

	`,
	category: 'Forms',
});

editor.BlockManager.add('landing-block-forms-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/5.png"/>
	<div class="my-label-block">Form 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font relative">
	<div class="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
	<div class="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
	<iframe width="100%" height="100%" class="absolute inset-0" frameborder="0" title="map" marginheight="0" marginwidth="0" scrolling="no" src="https://maps.google.com/maps?&height=600&hl=en&q=%C4%B0zmir+(My%20Business%20Name)&ie=UTF8&t=&z=14&iwloc=B&output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe>
	<div class="bg-white relative flex flex-wrap py-6 rounded shadow-md">
	<div class="lg:w-1/2 px-6">
	<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
	<p class="mt-1">Photo booth tattooed prism, portland taiyaki hoodie neutra typewriter</p>
	</div>
	<div class="lg:w-1/2 px-6 mt-4 lg:mt-0">
	<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
	<a class="text-indigo-500 leading-relaxed">example@email.com</a>
	<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
	<p class="leading-relaxed">123-456-7890</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
	<h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
	<p class="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p>
	<div class="relative mb-4">
	<label for="name" class="leading-7 text-sm text-gray-600">Name</label>
	<input type="text" id="name" name="name" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<div class="relative mb-4">
	<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
	<input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<div class="relative mb-4">
	<label for="message" class="leading-7 text-sm text-gray-600">Message</label>
	<textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
	</div>
	<button class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	<p class="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
	</div>
	</div>
	</section>
	
	`,
	category: 'Forms',
});editor.BlockManager.add('landing-block-forms-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/forms/6.png"/>
	<div class="my-label-block">Form 6</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font relative">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-12">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.</p>
	</div>
	<div class="lg:w-1/2 md:w-2/3 mx-auto">
	<div class="flex flex-wrap -m-2">
	<div class="p-2 w-1/2">
	<div class="relative">
	<label for="name" class="leading-7 text-sm text-gray-600">Name</label>
	<input type="text" id="name" name="name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	</div>
	<div class="p-2 w-1/2">
	<div class="relative">
	<label for="email" class="leading-7 text-sm text-gray-600">Email</label>
	<input type="email" id="email" name="email" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	</div>
	<div class="p-2 w-full">
	<div class="relative">
	<label for="message" class="leading-7 text-sm text-gray-600">Message</label>
	<textarea id="message" name="message" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
	</div>
	</div>
	<div class="p-2 w-full">
	<button class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
	</div>
	<div class="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
	<a class="text-indigo-500">example@email.com</a>
	<p class="leading-normal my-5">49 Smith St.
	<br>Saint Cloud, MN 56301
	</p>
	<span class="inline-flex">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-4 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-4 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-4 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</div>
	</div>
	</section>
	
	`,
	category: 'Forms',
});















////////////////////////////////////////
// GALLERIES
////////////////////////////////////////




editor.BlockManager.add('landing-block-galleries-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/galleries/1.png"/>
	<div class="my-label-block">Gallery 1</div>
	</div>
	`,
	content: `

	<section class="overflow-hidden text-gray-700 body-font">
	<div class="container px-5 py-2 mx-auto lg:pt-24 lg:px-32">
	<div class="flex flex-wrap -m-1 md:-m-2">
	<div class="flex flex-wrap w-1/2">
	<div class="w-1/2 p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/500x300/F3F4F7/8693ac">
	</div>
	<div class="w-1/2 p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/501x301/F3F4F7/8693ac">
	</div>
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/600x360/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/2">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/601x361/F3F4F7/8693ac">
	</div>
	<div class="w-1/2 p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/502x302/F3F4F7/8693ac">
	</div>
	<div class="w-1/2 p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/503x303/F3F4F7/8693ac">
	</div>
	</div>
	</div>
	</section>                                  

	`,
	category: 'Galleries',
});

editor.BlockManager.add('landing-block-galleries-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/galleries/2.png"/>
	<div class="my-label-block">Gallery 1</div>
	</div>
	`,
	content: `
	<section class="overflow-hidden text-gray-700 body-font">
	<div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
	<div class="flex flex-wrap -m-1 md:-m-2">
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	<div class="flex flex-wrap w-1/3">
	<div class="w-full p-1 md:p-2">
	<img alt="gallery" class="block object-cover object-center w-full  rounded-lg"
	src="https://dummyimage.com/800x600/F3F4F7/8693ac">
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Galleries',
});
editor.BlockManager.add('landing-block-galleries-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/galleries/3.png"/>
	<div class="my-label-block">Gallery 3</div>
	</div>
	`,
	content: `
	<section class="overflow-hidden text-gray-700 body-font">
	<div class="container px-5 py-2 mx-auto lg:px-32">
	<div class="flex flex-wrap justify-center mx-auto ">
	<div class="w-full mt-6 lg:w-2/4 lg:pl-10 lg:py-6 lg:mt-0">
	<img alt="image"
	class="object-cover object-center w-full h-64 rounded-lg lg:h-auto"
	src="https://dummyimage.com/400x400/F3F4F7/8693ac">
	</div>
	<div class="w-full mt-6 lg:w-2/4 lg:pl-10 lg:py-6 lg:mt-0">
	<img alt="image"
	class="object-cover object-center w-full h-64 rounded-lg lg:h-auto"
	src="https://dummyimage.com/400x400/F3F4F7/8693ac">
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Galleries',
});



editor.BlockManager.add('landing-block-galleries-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/galleries/4.png"/>
	<div class="my-label-block">Gallery 4</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
	<div class="lg:w-2/3 mx-auto">
	<div class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4">
	<img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/820x340">
	<div class="text-center relative z-10 w-full">
	<h2 class="text-2xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
	<p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	<div class="flex flex-wrap -mx-2">
	<div class="px-2 w-1/2">
	<div class="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
	<img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/542x460">
	<div class="text-center relative z-10 w-full">
	<h2 class="text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
	<p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	<div class="px-2 w-1/2">
	<div class="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
	<img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/542x420">
	<div class="text-center relative z-10 w-full">
	<h2 class="text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
	<p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
	<a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</a>
	</div>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Galleries',
});

editor.BlockManager.add('landing-block-galleries-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/galleries/5.png"/>
	<div class="my-label-block">Gallery 5</div>
	</div>
	`,
	content: `
	<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-col text-center w-full mb-20">
	<h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
	<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom.</p>
	</div>
	<div class="flex flex-wrap -m-4">
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/600x360">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">Shooting Stars</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/601x361">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">The Catalyzer</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/603x363">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">The 400 Blows</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/602x362">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">Neptune</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/605x365">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">Holden Caulfield</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	<div class="lg:w-1/3 sm:w-1/2 p-4">
	<div class="flex relative">
	<img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/606x366">
	<div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
	<h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
	<h1 class="title-font text-lg font-medium text-gray-900 mb-3">Alper Kamu</h1>
	<p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
	</div>
	</div>
	</div>
	</div>
	</div>
	</section>


	`,
	category: 'Galleries',
});




// editor.BlockManager.add('landing-block-galleries-6', {
// 	label: `
// 	<div>
// 	<img src="` + path + `/images/galleries/6.png"/>
// 	<div class="my-label-block">Gallery 6</div>
// 	</div>
// 	`,
// 	content: `



// 	`,
// 	category: 'Galleries',
// });


























//////////////////////
//  Footers
//////////////////////





editor.BlockManager.add('landing-block-footers-1', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/1.png"/>
	<div class="my-label-block">Footer 1</div>
	</div>
	`,
	content: `
	<section class="">
	<div class="container w-full p-20 m-4 mx-auto my-8 text-center bg-white border-2 border-dashed h-60 border-blueGray-300 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	-- Content goes here --
	</p>
	</div>
	</section>
	<footer class="text-gray-700 border-t body-font">
	<div class="container flex flex-col flex-wrap p-8 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap ">
	<div class="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left">
	<a class="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start ">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="text-lg font-bold tracking-tighter text-black uppercase transition duration-500 ease-in-out transform hover:text-lightBlack-500 ">
	Wickedblocks
	</h2>
	</a>
	</div>
	<div class="flex flex-wrap flex-grow mt-8 -mb-10 text-left md:pl-20 md:mt-0 ">
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">
	Product
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Email Templates</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Web Templates</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Figma Files</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Sketch Files</a>
	</li>
	</nav>
	</div>
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">
	Company
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Home</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">About</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Carriers</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Pricing</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800"> Security</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800"> Contact Us</a>
	</li>
	</nav>
	</div>
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">Legal
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Terms Of Service</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Trademark Policy</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Inactivity Policy</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800"> DPA</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">SLA</a>
	</li>
	</nav>
	</div>
	</div>
	</div>
	<div class="bg-black">
	<div class="container flex flex-col flex-wrap px-5 py-6 mx-auto sm:flex-row">
	<p class="text-sm text-center text-gray-200 sm:text-left ">© 2020
	</p>
	<span class="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start">
	<a class="text-white hover:text-blue-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-4 text-white hover:text-blue-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</a>
	<a class="ml-4 text-white hover:text-blue-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
	stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});
editor.BlockManager.add('landing-block-footers-2', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/2.png"/>
	<div class="my-label-block">Footer 2</div>
	</div>
	`,
	content: `
	<div
	class="container w-full p-20 m-4 mx-auto mt-4 text-center bg-white border-2 border-dashed h-60 border-blueGray-300 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	-- Content goes here --
	</p>
	</div>
	<footer class="mt-20 text-gray-700 bg-white border-t body-font">
	<div
	class="container flex flex-col flex-wrap p-5 py-10 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap ">
	<div class="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left">
	<a class="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start ">
	<div class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-cyan-400 to-lightBlue-500">
	</div>
	<h2
	class="text-lg font-bold tracking-tighter text-black uppercase transition duration-500 ease-in-out transform hover:text-lightBlack-500 ">
	Wickedblocks
	</h2>
	</a>
	<p class="mt-6 text-xs text-left text-gray-600">
	Wicked Templates helps you jumpstart a landing page by providing you with swapable sections.</p>
	</div>
	<div class="flex flex-wrap flex-grow mt-10 -mb-10 text-center md:pl-20 md:mt-0 md:text-left ">
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-medium tracking-widest text-black uppercase title-font">Product
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Email Templates</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Web Templates</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Figma Files</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Sketch Files</a>
	</li>
	</nav>
	</div>
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-medium tracking-widest text-black uppercase title-font">Company
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Home</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">About</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Carriers</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Pricing</a>
	</li>
	<li>
	</nav>
	</div>
	<div class="w-full px-4 lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">
	Subscribe
	</h1>
	<div class="flex mb-2">
	<input
	class="w-full px-4 py-2 mt-2 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg ext-blue-700 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
	id="grid-title" type="text" name="title" placeholder="From..." required="">
	</div>
	<div class="flex ">
	<button
	class="inline-flex w-full px-4 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg shadow-xl hover:bg-blueGray-900 focus:outline-none ocus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">Action
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
	stroke-width="2" class="w-4 h-4 my-auto ml-2" viewBox="0 0 24 24">
	<path d="M5 12h14M12 5l7 7-7 7"></path>
	</svg>
	</button>
	</div>
	</div>
	</div>
	</div>
	<div class="bg-black">
	<div class="container flex flex-col flex-wrap px-5 py-6 mx-auto sm:flex-row">
	<p class="text-sm text-center text-gray-200 sm:text-left ">© 2020
	</p>
	<span class="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start">
	<a class="ml-4 text-white hover:text-blue-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});

editor.BlockManager.add('landing-block-footers-3', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/3.png"/>
	<div class="my-label-block">Footer 3</div>
	</div>
	`,
	content: `
	<div
	class="container w-full p-20 m-4 mx-auto mt-6 text-center bg-white border-2 border-dashed h-72 border-blueGray-300 rounded-xl">
	<p class="mt-20 italic tracking-tighter text-md text-blueGray-500 title-font">
	-- Content goes here --
	</p>
	</div>
	<footer class="mt-6 text-gray-700 bg-white border-t body-font">
	<div
	class="container flex flex-col flex-wrap p-5 py-10 mx-auto lg:px-20 md:items-center lg:items-start md:flex-row md:flex-no-wrap ">
	<div class="flex flex-wrap flex-grow mx-auto mt-10 -mb-10 text-left md:mt-0 ">
	<div class="w-full lg:w-1/3 md:w-full">
	<h1 class="mb-8 text-2xl font-bold text-center text-black lg:text-left lg:text-2xl title-font">
	A pretty long lenght display headline ready to convert visitors into users.</h1>
	</div>
	<div class="w-full text-right lg:w-1/3 md:w-1/2 ">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">
	Company
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Home</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">About</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Carriers</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Pricing</a>
	</li>
	</nav>
	</div>
	<div class="w-full text-right lg:w-1/3 md:w-1/2">
	<h1 class="mb-3 text-sm font-semibold tracking-widest text-black uppercase title-font">Legal
	</h1>
	<nav class="mb-10 list-none">
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Terms Of Service</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Trademark Policy</a>
	</li>
	<li>
	<a class="text-sm text-gray-600 hover:text-gray-800">Inactivity Policy</a>
	</li>
	</nav>
	</div>
	</div>
	</div>
	<div class="bg-black">
	<div class="container flex flex-col flex-wrap px-5 py-6 mx-auto lg:px-20 sm:flex-row">
	<span class="inline-flex justify-center mt-2 sm:mt-0 sm:justify-start">
	<a class="ml-4 text-white hover:text-blue-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
	class="w-5 h-5" viewBox="0 0 24 24">
	<path
	d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
	</path>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});




editor.BlockManager.add('landing-block-footers-4', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/4.png"/>
	<div class="my-label-block">Footer 4</div>
	</div>
	`,
	content: `
	
	<footer class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
	<div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
	<a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<p class="mt-2 text-sm text-gray-500">Air plant banjo lyft occupy retro adaptogen indego</p>
	</div>
	<div class="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	</div>
	</div>
	<div class="bg-gray-100">
	<div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
	<p class="text-gray-500 text-sm text-center sm:text-left">© 2020 Tailblocks —
	<a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
	</p>
	<span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
	<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
	<circle cx="4" cy="4" r="2" stroke="none"></circle>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});

editor.BlockManager.add('landing-block-footers-5', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/5.png"/>
	<div class="my-label-block">Footer 5</div>
	</div>
	`,
	content: `
	
	<footer class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
	<div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:mt-0 mt-10">
	<a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<p class="mt-2 text-sm text-gray-500">Air plant banjo lyft occupy retro adaptogen indego</p>
	</div>
	<div class="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	</div>
	</div>
	<div class="bg-gray-100">
	<div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
	<p class="text-gray-500 text-sm text-center sm:text-left">© 2020 Tailblocks —
	<a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
	</p>
	<span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
	<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
	<circle cx="4" cy="4" r="2" stroke="none"></circle>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});
editor.BlockManager.add('landing-block-footers-6', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/6.png"/>
	<div class="my-label-block">Footer 6</div>
	</div>
	`,
	content: `
	
	<footer class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap md:text-left text-center -mb-10 -mx-4">
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/6 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	</div>
	</div>
	<div class="border-t border-gray-200">
	<div class="container px-5 py-8 flex flex-wrap mx-auto items-center">
	<div class="flex md:flex-nowrap flex-wrap justify-center items-end md:justify-start">
	<div class="relative sm:w-64 w-40 sm:mr-4 mr-2">
	<label for="footer-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
	<input type="text" id="footer-field" name="footer-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	<p class="text-gray-500 text-sm md:ml-6 md:mt-0 mt-2 sm:text-left text-center">Bitters chicharrones fanny pack
	<br class="lg:block hidden">waistcoat green juice
	</p>
	</div>
	<span class="inline-flex lg:ml-auto lg:mt-0 mt-6 w-full justify-center md:justify-start md:w-auto">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
	<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
	<circle cx="4" cy="4" r="2" stroke="none"></circle>
	</svg>
	</a>
	</span>
	</div>
	</div>
	<div class="bg-gray-100">
	<div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
	<p class="text-gray-500 text-sm text-center sm:text-left">© 2020 Tailblocks —
	<a href="https://twitter.com/knyttneve" class="text-gray-600 ml-1" target="_blank" rel="noopener noreferrer">@knyttneve</a>
	</p>
	<span class="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">Enamel pin tousled raclette tacos irony</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});
editor.BlockManager.add('landing-block-footers-7', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/7.png"/>
	<div class="my-label-block">Footer 7</div>
	</div>
	`,
	content: `
	
	<footer class="text-gray-600 body-font">
	<div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
	<a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2020 Tailblocks —
	<a href="https://twitter.com/knyttneve" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@knyttneve</a>
	</p>
	<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
	<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
	<circle cx="4" cy="4" r="2" stroke="none"></circle>
	</svg>
	</a>
	</span>
	</div>
	</footer>

	`,
	category: 'Footers',
});
editor.BlockManager.add('landing-block-footers-8', {
	label: `
	<div>
	<img draggable="false" src="` + path + `/images/footers/8.png"/>
	<div class="my-label-block">Footer 8</div>
	</div>
	`,
	content: `
	
	<footer class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap md:text-left text-center order-first">
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
	<nav class="list-none mb-10">
	<li>
	<a class="text-gray-600 hover:text-gray-800">First Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Second Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Third Link</a>
	</li>
	<li>
	<a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
	</li>
	</nav>
	</div>
	<div class="lg:w-1/4 md:w-1/2 w-full px-4">
	<h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SUBSCRIBE</h2>
	<div class="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
	<div class="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
	<label for="footer-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
	<input type="text" id="footer-field" name="footer-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
	</div>
	<button class="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
	</div>
	<p class="text-gray-500 text-sm mt-2 md:text-left text-center">Bitters chicharrones fanny pack
	<br class="lg:block hidden">waistcoat green juice
	</p>
	</div>
	</div>
	</div>
	<div class="bg-gray-100">
	<div class="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
	<a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
	<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
	</svg>
	<span class="ml-3 text-xl">Tailblocks</span>
	</a>
	<p class="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© 2020 Tailblocks —
	<a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
	</p>
	<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
	<a class="text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
	<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
	</svg>
	</a>
	<a class="ml-3 text-gray-500">
	<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
	<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
	<circle cx="4" cy="4" r="2" stroke="none"></circle>
	</svg>
	</a>
	</span>
	</div>
	</div>
	</footer>

	`,
	category: 'Footers',
});





// editor.BlockManager.add('landing-block-pricing-1', {
// 	label: `
// 	<div>
// 	<img src="` + path + `/images/pricing/1.png"/>
// 	<div class="my-label-block">Pricing 1</div>
// 	</div>
// 	`,
// 	content: `


// 	`,
// 	category: 'Pricing',
// });






//Commands

// editor.Panels.addButton('options',{
// 	id: 'undo',
// 	className: 'fa fa-undo',
// 	command: e => e.runCommand('core:undo'),
// });
// editor.Panels.addButton('options',{
// 	id: 'redo',
// 	className: 'fa fa-repeat',
// 	command: e => e.runCommand('core:redo'),
// });

// editor.Commands.add('cmdClear', e => confirm("Are you sure?") && e.runCommand('core:canvas-clear'));
// editor.Panels.addButton('options',{
// 	id: 'clear-canvas',
// 	className: 'fa fa-trash',
// 	command: 'cmdClear',
// 	attributes: { title: 'Clear'},
// });





// //remove builin code viewer
// editor.Panels.removeButton('options', 'export-template');



// const pfx = editor.getConfig('stylePrefix');
// const modal = editor.Modal;
// const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
// const container = document.createElement('div');
// const importLabel = 'Code editor';
// const importCnt = ' ';
// let viewerEditor = codeViewer.editor;



// //Import 
// editor.Panels.addButton('options',{
// 	id: 'import-editor',
//        className: 'fa fa-code', //I will change the icon to a better icon later if this code works
//        //label: 'Save to server',
//        command: {

//        	run(editor, sender) {
//        		sender && sender.set('active', false);

//   // Init import button
//   const btnImp = document.createElement('button');
//   btnImp.type = 'button';
//   btnImp.innerHTML = 'Update';
//   btnImp.className = `${pfx}btn-prim ${pfx}btn-import m-2`;
//   btnImp.onclick = e => {    
//   	editor.CssComposer.clear();
//   	editor.setComponents(viewerEditor.getValue().trim());
//   	modal.close();
//   };

//   // Init code viewer
//   codeViewer.set({ ...{
//   	codeName: 'htmlmixed',
//   	theme: 'default',
//   	class: 'ty',
//   	readOnly: 0
//   }, ...{}});


//   if (!viewerEditor) {
//   	const txtarea = document.createElement('textarea');

//         // if (importLabel) {
//         //   const labelEl = document.createElement('div');
//         //   labelEl.className = `${pfx}import-label`;
//         //   labelEl.innerHTML = 'Paste here your HTML/CSS and click Import';
//         //   container.appendChild(labelEl);
//         // }

//         container.appendChild(txtarea);
//         container.appendChild(btnImp);
//         codeViewer.init(txtarea);
//         viewerEditor = codeViewer.editor;
//     }

//     modal.setTitle('Code editor');
//     modal.setContent(container);      
//     const cnt = typeof importCnt == 'function' ? importCnt(editor) : importCnt;      
//     codeViewer.setContent('<style>' + editor.getCss() + '</style>' + editor.getHtml());
//     modal.open().getModel()
//     .once('change:open', () => editor.stopCommand(this.id));
//     viewerEditor.refresh();      

// },

// stop() {

// 	modal.close();
// }


// },
// attributes: { title: 'Code editor'},
// });






////////////////////
//  OCTOBER
//////////////////////



//October Partial Block

editor.BlockManager.add('october-partial-block', {
	label: 'October CMS partial',
	category: 'October CMS',
	content:`<div data-gjs-type="october-partial" october-partial="1" ></div>`,
	attributes: {
		class: 'fa fa-code'
	}
});

//October Content Block



editor.BlockManager.add('october-content-block', {
	label: 'October CMS Content',
	category: 'October CMS',
	content:`<div data-gjs-type="october-content" october-content="1" ></div>`,
	attributes: {
		class: 'fa fa-code'
	}
});





//SNIPPETS

/*

editor.BlockManager.add('static-snippet-block', {
	label: 'Snippet',
	category: 'Static Pages',
	content:`
	<style>
	figure {
		height: 40px;
		border-style: dashed;
		border-width: 1px;
		border-color: #757575;  
		margin: 0;
	}
	</style>
	<figure data-snippet=""></figure>`,
	attributes: {
		class: 'fa fa-code'
	}
});

*/







}
