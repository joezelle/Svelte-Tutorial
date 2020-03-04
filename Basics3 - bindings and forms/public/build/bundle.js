
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group) {
        const value = [];
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.push(group[i].__value);
        }
        return value;
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.19.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\CustomInput.svelte generated by Svelte v3.19.1 */

    const file = "src\\CustomInput.svelte";

    function create_fragment(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			add_location(input, file, 4, 0, 42);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*val*/ ctx[0]);
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*val*/ 1 && input.value !== /*val*/ ctx[0]) {
    				set_input_value(input, /*val*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { val } = $$props;
    	const writable_props = ["val"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CustomInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		val = this.value;
    		$$invalidate(0, val);
    	}

    	$$self.$set = $$props => {
    		if ("val" in $$props) $$invalidate(0, val = $$props.val);
    	};

    	$$self.$capture_state = () => ({ val });

    	$$self.$inject_state = $$props => {
    		if ("val" in $$props) $$invalidate(0, val = $$props.val);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [val, input_input_handler];
    }

    class CustomInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { val: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomInput",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*val*/ ctx[0] === undefined && !("val" in props)) {
    			console.warn("<CustomInput> was created without expected prop 'val'");
    		}
    	}

    	get val() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Toggle.svelte generated by Svelte v3.19.1 */

    const file$1 = "src\\Toggle.svelte";

    function create_fragment$1(ctx) {
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("button 1");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("button 2");
    			button0.disabled = button0_disabled_value = /*chosenOption*/ ctx[0] === 1;
    			add_location(button0, file$1, 4, 0, 55);
    			button1.disabled = button1_disabled_value = /*chosenOption*/ ctx[0] === 2;
    			add_location(button1, file$1, 7, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chosenOption*/ 1 && button0_disabled_value !== (button0_disabled_value = /*chosenOption*/ ctx[0] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*chosenOption*/ 1 && button1_disabled_value !== (button1_disabled_value = /*chosenOption*/ ctx[0] === 2)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { chosenOption = 1 } = $$props;
    	const writable_props = ["chosenOption"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, chosenOption = 1);
    	const click_handler_1 = () => $$invalidate(0, chosenOption = 2);

    	$$self.$set = $$props => {
    		if ("chosenOption" in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	$$self.$capture_state = () => ({ chosenOption });

    	$$self.$inject_state = $$props => {
    		if ("chosenOption" in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chosenOption, click_handler, click_handler_1];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { chosenOption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get chosenOption() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chosenOption(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.19.1 */
    const file$2 = "src\\App.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let updating_val;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let updating_chosenOption;
    	let t3;
    	let input0;
    	let input0_updating = false;
    	let t4;
    	let label0;
    	let input1;
    	let t5;
    	let t6;
    	let label1;
    	let input2;
    	let t7;
    	let t8;
    	let label2;
    	let input3;
    	let t9;
    	let t10;
    	let label3;
    	let input4;
    	let t11;
    	let t12;
    	let label4;
    	let input5;
    	let t13;
    	let t14;
    	let label5;
    	let input6;
    	let t15;
    	let t16;
    	let label6;
    	let input7;
    	let t17;
    	let t18;
    	let label7;
    	let input8;
    	let t19;
    	let t20;
    	let label8;
    	let input9;
    	let t21;
    	let t22;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let current;
    	let dispose;

    	function custominput_val_binding(value) {
    		/*custominput_val_binding*/ ctx[6].call(null, value);
    	}

    	let custominput_props = {};

    	if (/*name*/ ctx[0] !== void 0) {
    		custominput_props.val = /*name*/ ctx[0];
    	}

    	const custominput = new CustomInput({ props: custominput_props, $$inline: true });
    	binding_callbacks.push(() => bind(custominput, "val", custominput_val_binding));

    	function toggle_chosenOption_binding(value) {
    		/*toggle_chosenOption_binding*/ ctx[7].call(null, value);
    	}

    	let toggle_props = {};

    	if (/*selectedOption*/ ctx[1] !== void 0) {
    		toggle_props.chosenOption = /*selectedOption*/ ctx[1];
    	}

    	const toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, "chosenOption", toggle_chosenOption_binding));

    	function input0_input_handler() {
    		input0_updating = true;
    		/*input0_input_handler*/ ctx[8].call(input0);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(custominput.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			create_component(toggle.$$.fragment);
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label0 = element("label");
    			input1 = element("input");
    			t5 = text("\n    I agree to terms and conditions");
    			t6 = text("\n\n  \n  Favorite Color\n  ");
    			label1 = element("label");
    			input2 = element("input");
    			t7 = text("\n    Blue");
    			t8 = space();
    			label2 = element("label");
    			input3 = element("input");
    			t9 = text("\n    White");
    			t10 = space();
    			label3 = element("label");
    			input4 = element("input");
    			t11 = text("\n    Black");
    			t12 = space();
    			label4 = element("label");
    			input5 = element("input");
    			t13 = text("\n    Cobalt");
    			t14 = space();
    			label5 = element("label");
    			input6 = element("input");
    			t15 = text("\n    Blue");
    			t16 = space();
    			label6 = element("label");
    			input7 = element("input");
    			t17 = text("\n    White");
    			t18 = space();
    			label7 = element("label");
    			input8 = element("input");
    			t19 = text("\n    Black");
    			t20 = space();
    			label8 = element("label");
    			input9 = element("input");
    			t21 = text("\n    Cobalt");
    			t22 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Blue";
    			option1 = element("option");
    			option1.textContent = "cobalt";
    			option2 = element("option");
    			option2.textContent = "Sapphire";
    			add_location(p, file$2, 22, 2, 470);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$2, 27, 2, 583);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$2, 32, 4, 732);
    			add_location(label0, file$2, 31, 2, 720);
    			attr_dev(input2, "type", "radio");
    			input2.__value = "blue";
    			input2.value = input2.__value;
    			attr_dev(input2, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input2);
    			add_location(input2, file$2, 39, 4, 880);
    			add_location(label1, file$2, 38, 2, 868);
    			attr_dev(input3, "type", "radio");
    			input3.__value = "white";
    			input3.value = input3.__value;
    			attr_dev(input3, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input3);
    			add_location(input3, file$2, 43, 4, 988);
    			add_location(label2, file$2, 42, 2, 976);
    			attr_dev(input4, "type", "radio");
    			input4.__value = "black";
    			input4.value = input4.__value;
    			attr_dev(input4, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input4);
    			add_location(input4, file$2, 47, 4, 1098);
    			add_location(label3, file$2, 46, 2, 1086);
    			attr_dev(input5, "type", "radio");
    			input5.__value = "cobalt";
    			input5.value = input5.__value;
    			attr_dev(input5, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input5);
    			add_location(input5, file$2, 51, 4, 1208);
    			add_location(label4, file$2, 50, 2, 1196);
    			attr_dev(input6, "type", "checkbox");
    			input6.__value = "blue";
    			input6.value = input6.__value;
    			attr_dev(input6, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input6);
    			add_location(input6, file$2, 57, 4, 1349);
    			add_location(label5, file$2, 56, 2, 1337);
    			attr_dev(input7, "type", "checkbox");
    			input7.__value = "white";
    			input7.value = input7.__value;
    			attr_dev(input7, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input7);
    			add_location(input7, file$2, 61, 4, 1460);
    			add_location(label6, file$2, 60, 2, 1448);
    			attr_dev(input8, "type", "checkbox");
    			input8.__value = "black";
    			input8.value = input8.__value;
    			attr_dev(input8, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input8);
    			add_location(input8, file$2, 69, 4, 1597);
    			add_location(label7, file$2, 68, 2, 1585);
    			attr_dev(input9, "type", "checkbox");
    			input9.__value = "cobalt";
    			input9.value = input9.__value;
    			attr_dev(input9, "name", /*favColor*/ ctx[4]);
    			/*$$binding_groups*/ ctx[11][0].push(input9);
    			add_location(input9, file$2, 77, 4, 1734);
    			add_location(label8, file$2, 76, 2, 1722);
    			option0.__value = "blue";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 88, 4, 1928);
    			option1.__value = "cobalt";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 89, 4, 1967);
    			option2.__value = "Sapphire";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 90, 4, 2010);
    			attr_dev(select, "id", "");
    			if (/*selectedItem*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[19].call(select));
    			add_location(select, file$2, 87, 2, 1883);
    			add_location(main, file$2, 20, 0, 427);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(custominput, main, null);
    			append_dev(main, t0);
    			append_dev(main, p);
    			append_dev(p, t1);
    			append_dev(main, t2);
    			mount_component(toggle, main, null);
    			append_dev(main, t3);
    			append_dev(main, input0);
    			set_input_value(input0, /*price*/ ctx[2]);
    			append_dev(main, t4);
    			append_dev(main, label0);
    			append_dev(label0, input1);
    			input1.checked = /*agreed*/ ctx[3];
    			append_dev(label0, t5);
    			append_dev(main, t6);
    			append_dev(main, label1);
    			append_dev(label1, input2);
    			input2.checked = input2.__value === /*favColor*/ ctx[4];
    			append_dev(label1, t7);
    			append_dev(main, t8);
    			append_dev(main, label2);
    			append_dev(label2, input3);
    			input3.checked = input3.__value === /*favColor*/ ctx[4];
    			append_dev(label2, t9);
    			append_dev(main, t10);
    			append_dev(main, label3);
    			append_dev(label3, input4);
    			input4.checked = input4.__value === /*favColor*/ ctx[4];
    			append_dev(label3, t11);
    			append_dev(main, t12);
    			append_dev(main, label4);
    			append_dev(label4, input5);
    			input5.checked = input5.__value === /*favColor*/ ctx[4];
    			append_dev(label4, t13);
    			append_dev(main, t14);
    			append_dev(main, label5);
    			append_dev(label5, input6);
    			input6.checked = ~/*favColor*/ ctx[4].indexOf(input6.__value);
    			append_dev(label5, t15);
    			append_dev(main, t16);
    			append_dev(main, label6);
    			append_dev(label6, input7);
    			input7.checked = ~/*favColor*/ ctx[4].indexOf(input7.__value);
    			append_dev(label6, t17);
    			append_dev(main, t18);
    			append_dev(main, label7);
    			append_dev(label7, input8);
    			input8.checked = ~/*favColor*/ ctx[4].indexOf(input8.__value);
    			append_dev(label7, t19);
    			append_dev(main, t20);
    			append_dev(main, label8);
    			append_dev(label8, input9);
    			input9.checked = ~/*favColor*/ ctx[4].indexOf(input9.__value);
    			append_dev(label8, t21);
    			append_dev(main, t22);
    			append_dev(main, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*selectedItem*/ ctx[5]);
    			current = true;

    			dispose = [
    				listen_dev(input0, "input", input0_input_handler),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[9]),
    				listen_dev(input2, "change", /*input2_change_handler*/ ctx[10]),
    				listen_dev(input3, "change", /*input3_change_handler*/ ctx[12]),
    				listen_dev(input4, "change", /*input4_change_handler*/ ctx[13]),
    				listen_dev(input5, "change", /*input5_change_handler*/ ctx[14]),
    				listen_dev(input6, "change", /*input6_change_handler*/ ctx[15]),
    				listen_dev(input7, "change", /*input7_change_handler*/ ctx[16]),
    				listen_dev(input8, "change", /*input8_change_handler*/ ctx[17]),
    				listen_dev(input9, "change", /*input9_change_handler*/ ctx[18]),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[19])
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			const custominput_changes = {};

    			if (!updating_val && dirty & /*name*/ 1) {
    				updating_val = true;
    				custominput_changes.val = /*name*/ ctx[0];
    				add_flush_callback(() => updating_val = false);
    			}

    			custominput.$set(custominput_changes);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			const toggle_changes = {};

    			if (!updating_chosenOption && dirty & /*selectedOption*/ 2) {
    				updating_chosenOption = true;
    				toggle_changes.chosenOption = /*selectedOption*/ ctx[1];
    				add_flush_callback(() => updating_chosenOption = false);
    			}

    			toggle.$set(toggle_changes);

    			if (!input0_updating && dirty & /*price*/ 4) {
    				set_input_value(input0, /*price*/ ctx[2]);
    			}

    			input0_updating = false;

    			if (dirty & /*agreed*/ 8) {
    				input1.checked = /*agreed*/ ctx[3];
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input2, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input2.checked = input2.__value === /*favColor*/ ctx[4];
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input3, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input3.checked = input3.__value === /*favColor*/ ctx[4];
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input4, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input4.checked = input4.__value === /*favColor*/ ctx[4];
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input5, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input5.checked = input5.__value === /*favColor*/ ctx[4];
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input6, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input6.checked = ~/*favColor*/ ctx[4].indexOf(input6.__value);
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input7, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input7.checked = ~/*favColor*/ ctx[4].indexOf(input7.__value);
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input8, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input8.checked = ~/*favColor*/ ctx[4].indexOf(input8.__value);
    			}

    			if (!current || dirty & /*favColor*/ 16) {
    				attr_dev(input9, "name", /*favColor*/ ctx[4]);
    			}

    			if (dirty & /*favColor*/ 16) {
    				input9.checked = ~/*favColor*/ ctx[4].indexOf(input9.__value);
    			}

    			if (dirty & /*selectedItem*/ 32) {
    				select_option(select, /*selectedItem*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput.$$.fragment, local);
    			transition_in(toggle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput.$$.fragment, local);
    			transition_out(toggle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(custominput);
    			destroy_component(toggle);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input4), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input6), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input7), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input8), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input9), 1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let name = "";
    	let selectedOption = 1;
    	let price = 0;
    	let agreed;
    	let favColor = "blue";
    	let selectedItem;
    	const $$binding_groups = [[]];

    	function custominput_val_binding(value) {
    		name = value;
    		$$invalidate(0, name);
    	}

    	function toggle_chosenOption_binding(value) {
    		selectedOption = value;
    		$$invalidate(1, selectedOption);
    	}

    	function input0_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(2, price);
    	}

    	function input1_change_handler() {
    		agreed = this.checked;
    		$$invalidate(3, agreed);
    	}

    	function input2_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input3_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input4_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input5_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input6_change_handler() {
    		favColor = get_binding_group_value($$binding_groups[0]);
    		$$invalidate(4, favColor);
    	}

    	function input7_change_handler() {
    		favColor = get_binding_group_value($$binding_groups[0]);
    		$$invalidate(4, favColor);
    	}

    	function input8_change_handler() {
    		favColor = get_binding_group_value($$binding_groups[0]);
    		$$invalidate(4, favColor);
    	}

    	function input9_change_handler() {
    		favColor = get_binding_group_value($$binding_groups[0]);
    		$$invalidate(4, favColor);
    	}

    	function select_change_handler() {
    		selectedItem = select_value(this);
    		$$invalidate(5, selectedItem);
    	}

    	$$self.$capture_state = () => ({
    		CustomInput,
    		Toggle,
    		name,
    		selectedOption,
    		price,
    		agreed,
    		favColor,
    		selectedItem,
    		console
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("selectedOption" in $$props) $$invalidate(1, selectedOption = $$props.selectedOption);
    		if ("price" in $$props) $$invalidate(2, price = $$props.price);
    		if ("agreed" in $$props) $$invalidate(3, agreed = $$props.agreed);
    		if ("favColor" in $$props) $$invalidate(4, favColor = $$props.favColor);
    		if ("selectedItem" in $$props) $$invalidate(5, selectedItem = $$props.selectedItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedOption*/ 2) {
    			//   for checkboxes
    			//let favColor = ["blue"];
    			 console.log(selectedOption);
    		}

    		if ($$self.$$.dirty & /*price*/ 4) {
    			 console.log(price);
    		}

    		if ($$self.$$.dirty & /*agreed*/ 8) {
    			 console.log(agreed);
    		}

    		if ($$self.$$.dirty & /*favColor*/ 16) {
    			 console.log(favColor);
    		}

    		if ($$self.$$.dirty & /*selectedItem*/ 32) {
    			 console.log(selectedItem);
    		}
    	};

    	return [
    		name,
    		selectedOption,
    		price,
    		agreed,
    		favColor,
    		selectedItem,
    		custominput_val_binding,
    		toggle_chosenOption_binding,
    		input0_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		select_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
