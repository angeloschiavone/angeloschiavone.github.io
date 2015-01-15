
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

	/* ==== GOOGLE MAP ==== */
	if (document.getElement('#pageContatti #gmap')) {

		// map options
		var mapOptions = {
			zoom: 15,
			// center: new google.maps.LatLng(45.442363, 10.980915),
			//center: new google.maps.LatLng(45.441249, 10.987653),
			center: new google.maps.LatLng(45.5141936, 9.1710628),
			
			
			disableDefaultUI: false,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// create the map
		var map = new google.maps.Map(document.getElement("#gmap"),mapOptions);
		
		// add the marker
		//var latlng = new google.maps.LatLng(parseFloat(45.442363),parseFloat(10.980915));
		var latlng = new google.maps.LatLng(parseFloat(45.5141936),parseFloat(9.1710628));
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: 'Bed & Breakfast Da Canal',
			icon: '../media/img/icons/gmap_marker.png'
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = 'https://www.google.it/maps/place/Via+Privata+Bernardo+da+Canal,+24,+20161+Milano/@45.5141936,9.1710628,17z/data=!4m2!3m1!1s0x4786c0eb7f4ac60d:0x48789106df250089';
		});
	}
});


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
		this.frame = document.getElement('#pageHomepage > article > section > div');
		this.claims = document.getElements('body#pageHomepage article > aside > div p');
		if(!is_mobile) {
			this.frame.setStyle('backgroundImage','url("'+this.frame.getProperty('data-image')+'")');
		}
		this.claims.addEvent('click',function(){ window.location = document.getElement('body > header > div nav#menu a').getProperty('href'); });
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