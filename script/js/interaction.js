
/*//////////////////////////// DOMREADY ////////////////////////////
_______________________________________________________________________________________________________ */

window.addEvent('domready', function() {

	is_mobile = (window.getSize().x <= 480);

	/* ==== HEADER ==== */
	if (document.getElement('header')) {
		new pageHeader();
	}

	/* ==== HOMEPAGE ==== */
	if (document.getElement('#pageHomepage')) {
		new homePage();
	}

	/* ==== GALLERIA IMMAGINI (TRIGGERS) ==== */
	if (document.getElements('.opengallery').length > 0) {
		
		if(is_mobile) {
		
			// handle gallery triggers
			document.getElements('.opengallery').addEvent('click',function(e){

				// stop default event
				e.stop();
				
				// get index of clicked element
				var cur_id = e.target.getParent('a').getProperty('data-gallery-id');
				
				// open the gallery page at the anchor/index position
				window.location = "gallery.html#photo_id" + cur_id;
	
			});

		} else {

			// add the milkslider components at runtime...
			var milkCSS = Asset.css('../media/css/milkslide.css');
			var milkJS = Asset.javascript('../script/js/milkslide.js', {
				onLoad: function(){ 
					var myPhotoGallery = new photoGallery(); 
				}
			});

		}

	}
	
	/* ==== FORM PRENOTAZIONI ==== */
	if (document.getElement('#pagePrenotazioni')) {
		var myBookingForm = new bookingForm('#formPrenotazioni');
	}

	/* ==== GOOGLE MAP ==== */
	if (document.getElement('#pageContatti #gmap')) {

		// map options
		var mapOptions = {
			zoom: 15,
			// center: new google.maps.LatLng(45.442363, 10.980915),
			center: new google.maps.LatLng(45.441249, 10.987653),
			disableDefaultUI: false,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// create the map
		var map = new google.maps.Map(document.getElement("#gmap"),mapOptions);
		
		// add the marker
		var latlng = new google.maps.LatLng(parseFloat(45.442363),parseFloat(10.980915));
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: 'Il Relais dell\'Abbazia',
			icon: '/media/img/icons/gmap_marker.png'
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = 'http://maps.google.com/maps?f=q&q=Vicolo+dietro+Caserma+Chiodo,+18,+Verona,+VR+37123+ITALIA&ie=UTF8&om=1';
		});

	}

});


/*//////////////////////////// PAGELOAD ////////////////////////////
_______________________________________________________________________________________________________ */

//window.addEvent('load', function() { 	
//});	

/*//////////////////////////// FUNCTIONS ////////////////////////////
_______________________________________________________________________________________________________ */


/*//////////////////////////// CLASSES ////////////////////////////
_______________________________________________________________________________________________________ */


var pageHeader = new Class({

	initialize: function() {
	
		// store behaviour objects
		this.header = document.getElement('header');
		this.toggler = this.header.getElement('span.toggler');
		
		// add lower black line
		this.header.adopt(new Element('em.bottomline'));
		
		if(!Browser.Platform.ios) {
			// add fading black background
			this.header.adopt(new Element('em.blackfade'));
			// show/hide fading background on menu rollover
			this.header.getElements('nav').addEvents({
				'mouseenter':function(){this.header.addClass('darken')}.bind(this),
				'mouseleave':function(){this.header.removeClass('darken')}.bind(this)
			});
		}
		
		// handle the menu toggling on smartphones
		this.toggler.addEvent('click', function(e) { e.preventDefault(); document.getElement('#menu').toggleClass('collapsed'); });
		
		// set a delay on page load before collapsing the menu (only on mobile)
		window.addEvent('load', function() {
			// use this encapsulation, or you get an error!
			(function() { document.getElement('#menu').addClass('collapsed'); }).delay(1000);
		});	

	}

})

var homePage = new Class({

	initialize: function() {
	
		// store behaviour objects
		this.frame = document.getElement('#pageHomepage > article > section > div');
		this.claims = document.getElements('body#pageHomepage article > aside > div p');
		
		if(!is_mobile) {

			// use scripting for IE8/IE7
			//if(Browser.ie && Browser.version < 9) {
			//	this.pict = new Element('img').setProperty('src',this.frame.getProperty('data-image'));
			//	this.frame.grab(this.pict);
			// use css3 for other browsers
			//} else {
				this.frame.setStyle('backgroundImage','url("'+this.frame.getProperty('data-image')+'")');
			//}

		}
		
		// when user clicks on claims, go to first page of website
		this.claims.addEvent('click',function(){ window.location = document.getElement('body > header > div nav#menu a').getProperty('href'); });

	}

})

var bookingForm = new Class({

	initialize: function(form_id) {
	
		// set locale
		Locale.use('it-IT');
		
		// set custom locale translations
		var b = document.getElement('body');
		if(b.hasClass('en')) {
			this.mylocale = {
				"notvalid" : "not valid",
				"required" : "required",
				"verify" : "attention: please verify inserted data"
			};
		} else if(b.hasClass('de')) {
			this.mylocale = {
				"notvalid" : "ungültig",
				"required" : "pflichtangabe",
				"verify" : "achtung: überprüfen sie die eingegebenen daten"
			};
		} else if(b.hasClass('fr')) {
			this.mylocale = {
				"notvalid" : "incorrecte",
				"required" : "obligatoire",
				"verify" : "attention: vérifier les données entrées"
			};
		} else {
			this.mylocale = {
				"notvalid" : "non valido",
				"required" : "obbligatorio",
				"verify" : "attenzione: verificare i dati inseriti"
			};
		}
	
		// store behaviour objects
		this.form = document.getElement(form_id);
		this.formfields = this.form.getElements('input,textarea,select');
		this.formsubmit = this.form.getElement('fieldset.submit .button');
		this.formfeedback = this.form.getElement('#boxFormFeedback');
		this.selrooms = this.form.getElements('#room1beds,#room2beds,#room3beds');
		this.inpdates = this.form.getElements('#arrival,#departure');
		
		// add the highlight behaviour to input elements
		this.formfields.each(function(el){
			el.addEvents({
				focus: this.set_highlight_focused.pass(el,this),
				click: this.set_highlight_focused.pass(el,this),
				blur: this.unset_highlighted
			},this);
		},this);
		
		// handle the onchange for the room
		this.selrooms.addEvent('change',function(){
			var chk = this.getParent().getElement('input[type=checkbox]');
			if(this.get('value')!='' && !chk.checked) { chk.checked=true }
		});

		// handle the date-pickers
		if(Browser.Platform.ios) {
			this.inpdates.each(function(el){
				// create a native datepicker
				var el_ios = el.clone().setProperty('type','date').setProperty('name',el.getProperty('name')+'_ios').setProperty('id',el.getProperty('id')+'_ios');
				// hide text control
				el.setProperty('type','hidden');
				// inject the ios datepicker
				el.getParent().grab(el_ios);
				// handle change values of datepicker
				el_ios.addEvent('blur',function(){
					var cur_date_array = this.get('value').split('-');
					el.set('value',cur_date_array[2] + "/" + cur_date_array[1] + "/" + cur_date_array[0]);
				});

			}.bind(this));
		} else {
			var minPick = new Date();
			var maxPick = new Date().increment('month',12);
			new Picker.Date(this.inpdates, {
				positionOffset: {x: 0, y: 5},
				draggable: false,
				format: '%d/%m/%Y',
				// toggle: $$('.myLink')
				startView: 'days',
				minDate: minPick,
				maxDate: maxPick,
				yearsPerPage: 12,
				yearPicker: false,
				pickerClass: 'datepicker_dashboard'
			});
		}
		
		// handle form submission
		this.formsubmit.addEvent('click', this.send_form.bind(this));
		this.form.addEvent('keydown', function(e){ if (e.key == 'enter') { this.send_form(e); } }.bind(this));

	},

	unset_highlighted: function() {
		this.form.getElements('.focused').removeClass("focused");
	},

	set_highlight_focused: function(el) {
		this.unset_highlighted();
		document.id(el).getParent('.field').addClass("focused");
	},

	reset_validation: function() {
		this.form.getElements('.field.notvalid').removeClass('notvalid');
		this.form.getElements('.field i').set('text','*');
	},

	send_form: function(event) {
	
		// stop propagation
		event.stop();

		// avoid multiple submissions
		if(this.form.hasClass('disabled')) { return; }

		// temporarely disable submit button
		this.form.addClass('disabled');
		
		// remove previous not-valid messages
		this.reset_validation();
		
		// give user a feedback
		this.formfeedback.set('text','invio messaggio in corso...').setProperty('class','processing');
		
		// submit form via ajax
		new Request.JSON({ url: this.form.get('action'), data: "mode=ajax"+"&"+ this.form.toQueryString(), onComplete: this.show_feedback.bind(this) }).send();

	},

	show_feedback: function(response){

		if(response.status=='success') {
		
			// give user a feedback
			this.formfeedback.set('html',response.message).setProperty('class','success');
			
			// track event on google analytics
			try {
				_gaq.push(['_trackEvent',"prenotazioni_invio","completato"]);
			} catch(err) {}

			// delayed execution
			(function(){ 

				// reset feedback message
				this.formfeedback.set('html','').setProperty('class','');

				// remove previous not-valid messages
				this.reset_validation();
				
				// reset form
				this.form.reset();

				// re-enable submit button, at last...
				this.form.removeClass('disabled');

			}).delay(10000,this);
		
		} else if(response.status=='notvalid') {
		
			Object.each(response.validation,function(status,name) {
				
				// get field element
				var fld = this.form.getElement('[name='+name+']').getParent('.field');
				var msg = fld.getElement('i');

				// highlight field as not valid
				fld.addClass('notvalid');
				
				// update field message, if exists
				if(msg) {
					if(status.required) {
						msg.set('text',this.mylocale.required);
					} else {
						if(status.format) {
							msg.set('text',this.mylocale.notvalid);
						}
					}
				}
			},this);

			// give user a feedback
			this.formfeedback.set('html',this.mylocale.verify).setProperty('class','error');

			// re-enable submit button, at last...
			this.form.removeClass('disabled');

		} else {

			// give user a feedback
			this.formfeedback.set('html',response.message).setProperty('class','error');

			// re-enable submit button, at last...
			this.form.removeClass('disabled');

		}

	}

})

var photoGallery = new Class({

	initialize: function() {
	
		// create the Milkbox instance
		this.milkslide = new Milkslide({imageOfText:"di" });

		// store behaviour objects
		this.gallery_wrapper = document.getElement('figure#gallery');
		// this.gallery_items = this.gallery_wrapper.getElements('a');
		this.gallery_triggers = document.getElements('.opengallery');
		
		// build the indexed array of IDs to be used as parameter on the "open" method
		this.gallery_index = new Array();
		this.gallery_wrapper.getElements('a').each(function(el,i){
			this.gallery_index[el.getProperty('data-gallery-id').toString()] = i;
		}.bind(this));

		// handle gallery triggers
		this.gallery_triggers.addEvent('click',function(e){
			
			// stop default event
			e.stop();
			
			// get index of clicked element
			var cur_id = e.target.getParent('a').getProperty('data-gallery-id');
			
			// open the gallery at the index position
			this.milkslide.open('galleria',this.gallery_index[cur_id]);

		}.bind(this));

	}

})