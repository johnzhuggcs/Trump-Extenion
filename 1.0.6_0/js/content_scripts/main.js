
	var main_content_script_module = ( function () {

		var _priv = {

			text_nodes_under: ( node ) => {

				var all = [];

				for ( node = ( node.firstChild || ( node.shadowRoot && node.shadowRoot.firstChild ) ); node; node = node.nextSibling ) {

					if ( node.nodeType == 3 ) {

						all.push( node );

					} else {

						all = all.concat( _priv.text_nodes_under( node ) );

					};

				};

				return all;

			},

			process_text_node: ( node ) => {

				var index = node.textContent.indexOf( "Trump" );

				if ( index > -1 && !node.parentElement.isContentEditable ) {

					var new_node = node.splitText( index );
					var new_new_node = new_node.splitText( 5 );

					new_node.textContent = new_node.textContent.replace( "T", "" );
					var font_size = window.getComputedStyle( node.parentElement ).fontSize;

					var span = document.createElement( "span" );
					span.style.whiteSpace = "nowrap"
					new_node.before( span );
					span.appendChild( new_node );

					var img = document.createElement( "img" );
					img.src = chrome.extension.getURL( "/img/logo.png" );

					img.style.display = "inline";
					img.style.height = font_size;
					img.style.width = font_size;

					span.prepend( img );

				};

			},

			analyze_existing_nodes: () => {

				var node_arr = _priv.text_nodes_under( document );

				node_arr.forEach( ( node ) => {

					_priv.process_text_node( node );

				});

			},

			start_detecting: () => {

				var observer = new MutationObserver( ( record_arr ) => {

					record_arr.forEach( ( record ) => {

						var text_node_arr = _priv.text_nodes_under( record.target );

						if ( record.target.nodeType === 3 ) {

							_priv.process_text_node( record.target );

						} else {

							text_node_arr.forEach( ( text_node ) => {

								_priv.process_text_node( text_node );

							});

						};

					});

				});

				observer.observe( document, {

					childList: true,
					subtree: true,
					characterData: true,

				});

			},

		};

		var _pub = {

			init: ( app ) => {

				_priv.analyze_existing_nodes();
				_priv.start_detecting();

			},

		};

		return _pub;

	} () );

	( function () {

		main_content_script_module.init();

	} () );
