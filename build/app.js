(function () {
'use strict';

function auth(e){return{type:"auth",api_password:e}}function states(){return{type:"get_states"}}function config(){return{type:"get_config"}}function services(){return{type:"get_services"}}function panels(){return{type:"get_panels"}}function callService$1(e,t,n){var r={type:"call_service",domain:e,service:t};return n&&(r.service_data=n),r}function subscribeEvents$1(e){var t={type:"subscribe_events"};return e&&(t.event_type=e),t}function unsubscribeEvents(e){return{type:"unsubscribe_events",subscription:e}}function ping$1(){return{type:"ping"}}function error(e,t){return{type:"result",success:!1,error:{code:e,message:t}}}function extractResult(e){return e.result}function createConnection(e,t){var n=new Connection(e,t);return n.connect()}function getEntities(e){for(var t={},n=0;n<e.length;n++){var r=e[n];t[r.entity_id]=r;}return t}function updateState(e,t){var n=Object.assign({},e);return n[t.entity_id]=t,n}function removeState(e,t){var n=Object.assign({},e);return delete n[t],n}function subscribeEntities(e,t){return new Promise(function(n,r){function i(e){var n=e.data,r=n.entity_id,i=n.new_state;s=i?updateState(s,i):removeState(s,r),t(s);}var s=null,o=e.subscribeEvents(i,"state_changed"),c=e.getStates().then(function(e){s=getEntities(e),t(s);});Promise.all([o,c]).then(function(e){var t=e[0];return n(t)},function(){return r()});})}function extractDomain(e){return e.substr(0,e.indexOf("."))}function getGroupEntities(e,t){var n={};return t.attributes.entity_id.forEach(function(t){var r=e[t];r&&(n[r.entity_id]=r);}),n}function splitByGroups(e){var t=[],n={};return Object.keys(e).forEach(function(r){var i=e[r];"group"===extractDomain(r)?t.push(i):n[r]=i;}),t.sort(function(e,t){return e.attributes.order-t.attributes.order}),t.forEach(function(e){return e.attributes.entity_id.forEach(function(e){delete n[e];})}),{groups:t,ungrouped:n}}var ERR_CANNOT_CONNECT=1; var ERR_INVALID_AUTH=2; var ERR_CONNECTION_LOST=3; var Connection=function(e,t){this.url=e,this.options=t||{},this.commandId=1,this.commands={},this.connectionTries=0,this.eventListeners={},this.closeRequested=!1;};Connection.prototype.addEventListener=function(e,t){var n=this.eventListeners[e];n||(n=this.eventListeners[e]=[]),n.push(t);},Connection.prototype.fireEvent=function(e){var t=this;(this.eventListeners[e]||[]).forEach(function(e){return e(t)});},Connection.prototype.connect=function(){var e=this;return new Promise(function(t,n){var r=e.commands;Object.keys(r).forEach(function(e){var t=r[e];t.reject&&t.reject(error(ERR_CONNECTION_LOST,"Connection lost"));});var i=!1;e.connectionTries+=1,e.socket=new WebSocket(e.url),e.socket.addEventListener("open",function(){e.connectionTries=0;}),e.socket.addEventListener("message",function(s){var o=JSON.parse(s.data);switch(o.type){case"event":e.commands[o.id].eventCallback(o.event);break;case"result":o.success?e.commands[o.id].resolve(o):e.commands[o.id].reject(o.error),delete e.commands[o.id];break;case"pong":break;case"auth_required":e.sendMessage(auth(e.options.authToken));break;case"auth_invalid":n(ERR_INVALID_AUTH),i=!0;break;case"auth_ok":t(e),e.fireEvent("ready"),e.commandId=1,e.commands={},Object.keys(r).forEach(function(t){var n=r[t];n.eventType&&e.subscribeEvents(n.eventCallback,n.eventType).then(function(e){n.unsubscribe=e;});});}}),e.socket.addEventListener("close",function(){if(!i&&!e.closeRequested){0===e.connectionTries?e.fireEvent("disconnected"):n(ERR_CANNOT_CONNECT);var t=1e3*Math.min(e.connectionTries,5);setTimeout(function(){return e.connect()},t);}});})},Connection.prototype.close=function(){this.closeRequested=!0,this.socket.close();},Connection.prototype.getStates=function(){return this.sendMessagePromise(states()).then(extractResult)},Connection.prototype.getServices=function(){return this.sendMessagePromise(services()).then(extractResult)},Connection.prototype.getPanels=function(){return this.sendMessagePromise(panels()).then(extractResult)},Connection.prototype.getConfig=function(){return this.sendMessagePromise(config()).then(extractResult)},Connection.prototype.callService=function(e,t,n){return this.sendMessagePromise(callService$1(e,t,n))},Connection.prototype.subscribeEvents=function(e,t){var n=this;return this.sendMessagePromise(subscribeEvents$1(t)).then(function(r){var i={eventCallback:e,eventType:t,unsubscribe:function(){return n.sendMessagePromise(unsubscribeEvents(r.id)).then(function(){delete n.commands[r.id];})}};return n.commands[r.id]=i,function(){return i.unsubscribe()}})},Connection.prototype.ping=function(){return this.sendMessagePromise(ping$1())},Connection.prototype.sendMessage=function(e){this.socket.send(JSON.stringify(e));},Connection.prototype.sendMessagePromise=function(e){var t=this;return new Promise(function(n,r){t.commandId+=1;var i=t.commandId;e.id=i,t.commands[i]={resolve:n,reject:r},t.sendMessage(e);})};

var template$2 = (function () {

  const switchDomains = ['light', 'switch'];

  return {
    helpers: {
      canSwitch:
        entity => switchDomains.indexOf(extractDomain(entity.entity_id)) !== -1,
    }
  }

}());

function renderMainFragment$2 ( root, component, target ) {
	var div = document.createElement( 'div' );
	div.className = "mdl-list__item";
	
	var span = document.createElement( 'span' );
	span.className = "mdl-list__item-primary-content";
	
	var text = document.createTextNode( "\n    " );
	span.appendChild( text );
	
	var span1 = document.createElement( 'span' );
	
	var text1 = document.createTextNode( root.entity.attributes.friendly_name );
	span1.appendChild( text1 );
	
	span.appendChild( span1 );
	
	div.appendChild( span );
	
	var text2 = document.createTextNode( "\n  " );
	div.appendChild( text2 );
	
	var span2 = document.createElement( 'span' );
	span2.className = "mdl-list__item-secondary-action";
	
	var ifBlock_0_anchor = document.createComment( "#if canSwitch(entity)" );
	span2.appendChild( ifBlock_0_anchor );
	
	var ifBlock_0 = null;
	var elseBlock_0 = null;
	
	if ( template$2.helpers.canSwitch(root.entity) ) {
		ifBlock_0 = renderIfBlock_0$2( root, component, span2, ifBlock_0_anchor );
	} else {
		elseBlock_0 = renderElseBlock_0( root, component, span2, ifBlock_0_anchor );
	}
	
	div.appendChild( span2 );
	
	target.appendChild( div );

	return {
		update: function ( changed, root ) {
			text1.data = root.entity.attributes.friendly_name;
			
			if ( template$2.helpers.canSwitch(root.entity) ) {
				if ( !ifBlock_0 ) {
					ifBlock_0 = renderIfBlock_0$2( root, component, span2, ifBlock_0_anchor );
				} else {
					ifBlock_0.update( changed, root );
				}
				
				if ( elseBlock_0 ) {
					elseBlock_0.teardown( true );
					elseBlock_0 = null;
				}
			}
			
			else {
				if ( ifBlock_0 ) {
					ifBlock_0.teardown( true );
					ifBlock_0 = null;
				}
				
				if ( !elseBlock_0 ) {
					elseBlock_0 = renderElseBlock_0( root, component, span2, ifBlock_0_anchor );
				} else {
					elseBlock_0.update( changed, root );
				}
			}
			if ( elseBlock_0 ) elseBlock_0.update( changed, root );
		},

		teardown: function ( detach ) {
			if ( detach ) div.parentNode.removeChild( div );
			
			
			
			text.parentNode.removeChild( text );
			
			
			
			text2.parentNode.removeChild( text2 );
			
			
			
			if ( ifBlock_0 ) ifBlock_0.teardown( detach );
			if ( elseBlock_0 ) elseBlock_0.teardown( detach );
		}
	};
}

function renderElseBlock_0 ( root, component, target, anchor ) {
	var text = document.createTextNode( "\n      " );
	anchor.parentNode.insertBefore( text, anchor );
	
	var text1 = document.createTextNode( root.entity.state );
	anchor.parentNode.insertBefore( text1, anchor );
	
	var text2 = document.createTextNode( "\n    " );
	anchor.parentNode.insertBefore( text2, anchor );

	return {
		update: function ( changed, root ) {
			text1.data = root.entity.state;
		},

		teardown: function ( detach ) {
			text.parentNode.removeChild( text );
			
			text2.parentNode.removeChild( text2 );
		}
	};
}

function renderIfBlock_0$2 ( root, component, target, anchor ) {
	var input = document.createElement( 'input' );
	input.setAttribute( 'data-entity_id', root.entity.entity_id );
	input.type = "checkbox";
	input.className = "mdl-switch__input";
	input.checked = root.entity.state == 'on';
	
	anchor.parentNode.insertBefore( input, anchor );

	return {
		update: function ( changed, root ) {
			input.setAttribute( 'data-entity_id', root.entity.entity_id );
			input.checked = root.entity.state == 'on';
		},

		teardown: function ( detach ) {
			if ( detach ) input.parentNode.removeChild( input );
		}
	};
}

function EntityRow ( options ) {
	var component = this;
	var state = options.data || {};

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( const key in group ) {
			if ( !( key in newState ) ) continue;

			const newValue = newState[ key ];
			const oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			const callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( let i = 0; i < callbacks.length; i += 1 ) {
				const callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return state[ key ];
	};

	this.set = function set ( newState ) {
		const oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
	};

	this.observe = function ( key, callback, options = {} ) {
		const group = options.defer ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel () {
				const index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		const handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				const index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	var mainFragment = renderMainFragment$2( state, this, options.target );
}

function applyComputations$1 ( state, newState, oldState ) {
	if ( ( 'entities' in newState && typeof state.entities === 'object' || state.entities !== oldState.entities ) || ( 'group' in newState && typeof state.group === 'object' || state.group !== oldState.group ) ) {
		state.entList = newState.entList = template$1.computed.entList( state.entities, state.group );
	}
}

var template$1 = (function () {
  return {
    computed: {
      entList: (entities, group) => {
        const result = getGroupEntities(entities, group);
        return Object.keys(result).map(key => result[key]);
      },
    },

    components: {
      EntityRow
    }
  }
}());

let addedCss$1 = false;
function addCss$1 () {
	var style = document.createElement( 'style' );
	style.textContent = "       \n .mdl-card[svelte-1786261835], [svelte-1786261835] .mdl-card {\n  margin-right: 16px;\n  margin-bottom: 16px;\n }\n\n .mdl-card__title[svelte-1786261835], [svelte-1786261835] .mdl-card__title {\n  text-transform: capitalize;\n }\n\n .mdl-list[svelte-1786261835], [svelte-1786261835] .mdl-list {\n  padding: 0;\n }\n";
	document.head.appendChild( style );

	addedCss$1 = true;
}

function renderMainFragment$1 ( root, component, target ) {
	var div = document.createElement( 'div' );
	div.setAttribute( 'svelte-1786261835', '' );
	div.className = "mdl-card mdl-shadow--2dp";
	
	var div1 = document.createElement( 'div' );
	div1.className = "mdl-card__title";
	
	var h2 = document.createElement( 'h2' );
	h2.className = "mdl-card__title-text";
	
	var text = document.createTextNode( root.group.attributes.friendly_name );
	h2.appendChild( text );
	
	div1.appendChild( h2 );
	
	div.appendChild( div1 );
	
	var text1 = document.createTextNode( "\n  " );
	div.appendChild( text1 );
	
	var div2 = document.createElement( 'div' );
	div2.className = "mdl-card__supporting-text";
	
	var div3 = document.createElement( 'div' );
	div3.className = "mdl-list";
	
	var eachBlock_0_anchor = document.createComment( "#each entList" );
	div3.appendChild( eachBlock_0_anchor );
	
	var eachBlock_0_value = root.entList;
	var eachBlock_0_fragment = document.createDocumentFragment();
	var eachBlock_0_iterations = [];
	
	for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
		eachBlock_0_iterations[i] = renderEachBlock_0$1( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
	}
	
	eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
	
	div2.appendChild( div3 );
	
	div.appendChild( div2 );
	
	target.appendChild( div );

	return {
		update: function ( changed, root ) {
			text.data = root.group.attributes.friendly_name;
			
			var eachBlock_0_value = root.entList;
			
			for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
				if ( !eachBlock_0_iterations[i] ) {
					eachBlock_0_iterations[i] = renderEachBlock_0$1( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
				} else {
					eachBlock_0_iterations[i].update( changed, root, eachBlock_0_value, eachBlock_0_value[i], i );
				}
			}
			
			for ( var i = eachBlock_0_value.length; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( true );
			}
			
			eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
			eachBlock_0_iterations.length = eachBlock_0_value.length;
		},

		teardown: function ( detach ) {
			if ( detach ) div.parentNode.removeChild( div );
			
			
			
			
			
			text1.parentNode.removeChild( text1 );
			
			
			
			
			
			for ( let i = 0; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( detach );
			}
			
			if ( detach ) eachBlock_0_anchor.parentNode.removeChild( eachBlock_0_anchor );
		}
	};
}

function renderEachBlock_0$1 ( root, eachBlock_0_value, entity, entity__index, component, target ) {
	var ifBlock_0_anchor = document.createComment( "#if entity.attributes.friendly_name" );
	target.appendChild( ifBlock_0_anchor );
	
	var ifBlock_0 = entity.attributes.friendly_name ? renderIfBlock_0$1( root, eachBlock_0_value, entity, entity__index, component, target, ifBlock_0_anchor ) : null;

	return {
		update: function ( changed, root, eachBlock_0_value, entity, entity__index ) {
			var entity = eachBlock_0_value[entity__index];
			
			if ( entity.attributes.friendly_name ) {
				if ( !ifBlock_0 ) {
					ifBlock_0 = renderIfBlock_0$1( root, eachBlock_0_value, entity, entity__index, component, target, ifBlock_0_anchor );
				} else {
					ifBlock_0.update( changed, root, eachBlock_0_value, entity, entity__index );
				}
			}
			
			else {
				if ( ifBlock_0 ) {
					ifBlock_0.teardown( true );
					ifBlock_0 = null;
				}
			}
		},

		teardown: function ( detach ) {
			if ( ifBlock_0 ) ifBlock_0.teardown( detach );
			if ( detach ) ifBlock_0_anchor.parentNode.removeChild( ifBlock_0_anchor );
		}
	};
}

function renderIfBlock_0$1 ( root, eachBlock_0_value, entity, entity__index, component, target, anchor ) {
	var entityRow_initialData = {
		entity: entity
	};
	
	var entityRow = new template$1.components.EntityRow({
		target: target,
		parent: component,
		data: entityRow_initialData
	});

	return {
		update: function ( changed, root, eachBlock_0_value, entity, entity__index ) {
			var entityRow_changes = {};
			
			if ( 'entList' in changed ) entityRow_changes.entity = entity;
			
			if ( Object.keys( entityRow_changes ).length ) entityRow.set( entityRow_changes );
		},

		teardown: function ( detach ) {
			entityRow.teardown( true );
		}
	};
}

function GroupCard ( options ) {
	var component = this;
	var state = options.data || {};
applyComputations$1( state, state, {} );

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( const key in group ) {
			if ( !( key in newState ) ) continue;

			const newValue = newState[ key ];
			const oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			const callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( let i = 0; i < callbacks.length; i += 1 ) {
				const callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return state[ key ];
	};

	this.set = function set ( newState ) {
		const oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		applyComputations$1( state, newState, oldState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
		
		while ( this.__renderHooks.length ) {
			var hook = this.__renderHooks.pop();
			hook.fn.call( hook.context );
		}
	};

	this.observe = function ( key, callback, options = {} ) {
		const group = options.defer ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel () {
				const index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		const handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				const index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	if ( !addedCss$1 ) addCss$1();
	
	this.__renderHooks = [];
	
	var mainFragment = renderMainFragment$1( state, this, options.target );
	
	while ( this.__renderHooks.length ) {
		var hook = this.__renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

function applyComputations ( state, newState, oldState ) {
	if ( ( 'entities' in newState && typeof state.entities === 'object' || state.entities !== oldState.entities ) ) {
		state.groups = newState.groups = template.computed.groups( state.entities );
	}
}

var template = (function () {
  return {
    methods: {
      handleChange({ target }) {
        const entity_id = target.dataset.entity_id;
        const service = target.checked ? 'turn_on' : 'turn_off';
        this.get('conn').callService('homeassistant', service, {entity_id});
      }
    },

    data () {
      return {
        entities: {}
      };
    },

    computed: {
      groups: entities => splitByGroups(entities).groups,
    },

    components: {
      GroupCard
    }
  }
}());

let addedCss = false;
function addCss () {
	var style = document.createElement( 'style' );
	style.textContent = "       \n  .cards[svelte-199336295], [svelte-199336295] .cards {\n    display: flex;\n    flex-wrap: wrap;\n    padding-top: 16px;\n    padding-left: 16px;\n  }\n";
	document.head.appendChild( style );

	addedCss = true;
}

function renderMainFragment ( root, component, target ) {
	var div = document.createElement( 'div' );
	div.setAttribute( 'svelte-199336295', '' );
	div.className = "cards";
	function changeHandler ( event ) {
		component.handleChange(event);
	}
	
	div.addEventListener( 'change', changeHandler, false );
	
	var eachBlock_0_anchor = document.createComment( "#each groups" );
	div.appendChild( eachBlock_0_anchor );
	
	var eachBlock_0_value = root.groups;
	var eachBlock_0_fragment = document.createDocumentFragment();
	var eachBlock_0_iterations = [];
	
	for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
		eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
	}
	
	eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
	
	target.appendChild( div );

	return {
		update: function ( changed, root ) {
			var eachBlock_0_value = root.groups;
			
			for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
				if ( !eachBlock_0_iterations[i] ) {
					eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
				} else {
					eachBlock_0_iterations[i].update( changed, root, eachBlock_0_value, eachBlock_0_value[i], i );
				}
			}
			
			for ( var i = eachBlock_0_value.length; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( true );
			}
			
			eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
			eachBlock_0_iterations.length = eachBlock_0_value.length;
		},

		teardown: function ( detach ) {
			div.removeEventListener( 'change', changeHandler, false );
			if ( detach ) div.parentNode.removeChild( div );
			
			for ( let i = 0; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( detach );
			}
			
			if ( detach ) eachBlock_0_anchor.parentNode.removeChild( eachBlock_0_anchor );
		}
	};
}

function renderEachBlock_0 ( root, eachBlock_0_value, group, group__index, component, target ) {
	var ifBlock_0_anchor = document.createComment( "#if !group.attributes.hidden" );
	target.appendChild( ifBlock_0_anchor );
	
	var ifBlock_0 = !group.attributes.hidden ? renderIfBlock_0( root, eachBlock_0_value, group, group__index, component, target, ifBlock_0_anchor ) : null;

	return {
		update: function ( changed, root, eachBlock_0_value, group, group__index ) {
			var group = eachBlock_0_value[group__index];
			
			if ( !group.attributes.hidden ) {
				if ( !ifBlock_0 ) {
					ifBlock_0 = renderIfBlock_0( root, eachBlock_0_value, group, group__index, component, target, ifBlock_0_anchor );
				} else {
					ifBlock_0.update( changed, root, eachBlock_0_value, group, group__index );
				}
			}
			
			else {
				if ( ifBlock_0 ) {
					ifBlock_0.teardown( true );
					ifBlock_0 = null;
				}
			}
		},

		teardown: function ( detach ) {
			if ( ifBlock_0 ) ifBlock_0.teardown( detach );
			if ( detach ) ifBlock_0_anchor.parentNode.removeChild( ifBlock_0_anchor );
		}
	};
}

function renderIfBlock_0 ( root, eachBlock_0_value, group, group__index, component, target, anchor ) {
	var groupCard_initialData = {
		entities: root.entities,
		group: group
	};
	
	var groupCard = new template.components.GroupCard({
		target: target,
		parent: component,
		data: groupCard_initialData
	});

	return {
		update: function ( changed, root, eachBlock_0_value, group, group__index ) {
			var groupCard_changes = {};
			
			if ( 'entities' in changed ) groupCard_changes.entities = root.entities;
			if ( 'groups' in changed ) groupCard_changes.group = group;
			
			if ( Object.keys( groupCard_changes ).length ) groupCard.set( groupCard_changes );
		},

		teardown: function ( detach ) {
			groupCard.teardown( true );
		}
	};
}

function App ( options ) {
	var component = this;
	var state = Object.assign( template.data(), options.data );
applyComputations( state, state, {} );

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( const key in group ) {
			if ( !( key in newState ) ) continue;

			const newValue = newState[ key ];
			const oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			const callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( let i = 0; i < callbacks.length; i += 1 ) {
				const callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return state[ key ];
	};

	this.set = function set ( newState ) {
		const oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		applyComputations( state, newState, oldState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
		
		while ( this.__renderHooks.length ) {
			var hook = this.__renderHooks.pop();
			hook.fn.call( hook.context );
		}
	};

	this.observe = function ( key, callback, options = {} ) {
		const group = options.defer ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel () {
				const index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		const handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				const index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	if ( !addedCss ) addCss();
	
	this.__renderHooks = [];
	
	var mainFragment = renderMainFragment( state, this, options.target );
	
	while ( this.__renderHooks.length ) {
		var hook = this.__renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

App.prototype = template.methods;

var app = new App({
  target: document.querySelector( '.page-content' ),
  data: {
    entities: {}
  }
});

createConnection('ws://localhost:8123/api/websocket').then(conn => {
  app.set({conn});

  subscribeEntities(
    conn,
    entities => {
      console.log(entities);
      app.set({entities});
    });
});

}());
