module.exports = RED => {
	let ui;

	RED.nodes.registerType( 'ui_clock', function( config ) {
		RED.nodes.createNode( this, config );

		if( !ui ) {
			try {
				ui = RED.require( 'node-red-dashboard' )( RED );
			} catch {}
		}

		if( ui && RED.nodes.getNode( config.group ) ) {
			this.on( 'close', ui.addWidget( {
				node: this,
				format: `
					<svg version="1.1" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
						<g style="fill: ${config.backgroundColor}">
							<circle cx="500" cy="500" r="500" />
						</g>
						<g style="fill: ${config.dotsColor}">
							<circle cx="500" cy="25" r="25" />
							<circle cx="737.5" cy="88.638" r="25" />
							<circle cx="911.36" cy="262.5" r="25" />
							<circle cx="975" cy="500" r="25" />
							<circle cx="911.36" cy="737.5" r="25" />
							<circle cx="737.5" cy="911.36" r="25" />
							<circle cx="500" cy="975" r="25" />
							<circle cx="262.5" cy="911.36" r="25" />
							<circle cx="88.638" cy="737.5" r="25" />
							<circle cx="25" cy="500" r="25" />
							<circle cx="88.638" cy="262.5" r="25" />
							<circle cx="262.5" cy="88.638" r="25" />
						</g>
						<g style="stroke: ${config.hourminColor}">
							<line id="ui_clock_{{ $id }}_h" x1="500" y1="500" x2="500" y2="200" stroke-linecap="round" stroke-width="30" />
							<line id="ui_clock_{{ $id }}_m" x1="500" y1="500" x2="500" y2="75" stroke-linecap="round" stroke-width="20" />
						</g>
						<g style="stroke: ${config.secsColor}">
							<line id="ui_clock_{{ $id }}_s" x1="500" y1="500" x2="500" y2="25" stroke-linecap="round" stroke-width="10" />
						</g>
					</svg>
					<input type="hidden" value="{{ msg.payload }}" />
				`,
				width: +config.width || +RED.nodes.getNode( config.group ).config.width,
				height: +config.height || +RED.nodes.getNode( config.group ).config.width,
				group: config.group,
				order: config.order,
				initController: $scope => $scope.$watch( 'msg.payload', payload => {
					const date = new Date( +payload || 0 );

					$( `#ui_clock_${ $scope.$id }_s` ).attr( 'transform', `rotate( ${ date.getSeconds() * 6 }, 500, 500 )` );
					$( `#ui_clock_${ $scope.$id }_m` ).attr( 'transform', `rotate( ${ ( date.getMinutes() + date.getSeconds() / 60 ) * 6 }, 500, 500 )` );
					$( `#ui_clock_${ $scope.$id }_h` ).attr( 'transform', `rotate( ${ ( date.getHours() + date.getMinutes() / 60 ) * 30 }, 500, 500 )` );
				} )
			} ) );
		}
	} );
};