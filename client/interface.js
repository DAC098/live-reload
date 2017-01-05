(function() {

	function addClass(ele,class_name) {
		var cur_classes = ele.className;
		ele.className = cur_classes.length != 0 ? ele.className + ' ' + class_name : class_name;
	}

	function removeClass(ele,class_name) {
		var class_reg = new RegExp(class_name);
		ele.className.replace(class_reg,'');
	}

	function render() {

		var container = document.createElement('div');
		container.id = 'live-reload-ui';
		container.innerHTML = `
		<section id='lr-config-list'>
			<button id='make-config' type="button" name="make-config">New Config</button>
		</section>
		<section id='lr-config-form' class='inactive'>
			<form>
				<input id='create-config' type="button" name="create" value="Create">
				<input id='cancel-config' type="button" name="cancel" value="Cancel">
				<input type="text" name="config-name" placeholder='Config name' value="">
				<input id='add-sub' type="button" name="add" value="Add Sub">
				<input type="text" name="root" placeholder='Root dir' value="">
				<div id="sub-dir-container">
					<input type="text" name="sub-dir" placeholder='Sub dir' value="">
				</div>
			</form>
		</section>`;

		document.getElementsByTagName('body')[0].appendChild(container);

		var config_form = document.getElementById('lr-config-form');

		var make_config_btn = document.getElementById('make-config');

		var create_config = document.getElementById('create-config');

		var cancel_config = document.getElementById('cancel-config');

		make_config_btn.addEventListener('click',function(event) {
			config_form.className = 'active';
		});

		cancel_config.addEventListener('click',function(event) {
			config_form.className = '';
		})

		var input_add_sub = document.getElementById('add-sub');
		var sub_dirs_container = document.getElementById('sub-dir-container');

		input_add_sub.addEventListener('click',function(event) {
			var new_sub_input = document.createElement('input');
			new_sub_input.type = 'text';
			new_sub_input.name = 'sub-dir';
			new_sub_input.placeholder = 'Sub dir';
			new_sub_input.value = '';
			sub_dirs_container.appendChild(new_sub_input);
		});
	}

	module.exports = render;

})();
