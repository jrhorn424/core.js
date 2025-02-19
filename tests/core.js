const { Core, ALL } = require(`../dist/core.umd.js`);

const createModuleMock = () => {
    const module = {
        started: 0,
        stopped: 0,
    };
    return Object.assign(module, {
        start() {
            module.started += 1;
        },
        stop() {
            module.stopped += 1;
        },
    });
};

let core;
describe(`Testing Core`, function () {

    beforeEach(function () {
        core = new Core();
    });

    afterEach(function () {
    });

    it(`should call start of that module`, async function () {
        const module = createModuleMock();
        await core.start(module);

        expect(module.started).toBe(1);
    });

    it(`should fail if start is undefined`, async function () {
        const module = createModuleMock();
        delete module[`start`];

        await expectAsync(
            core.start(module)
        ).toBeRejected();
    });

    it(`should call stop of that module`, async function () {
        const module = createModuleMock();
        const id = await core.start(module);
        await core.stop(id);

        expect(module.stopped).toBe(1);
    });

    it(`should not fail if stop is undefined`, async function () {
        const module = createModuleMock();
        delete module[`stop`];
        const id = await core.start(module);
        await core.stop(id);

        expect(module.started).toBe(1);
    });

    it(`should use the name as id if it was provided`, async function () {
        const name = `myName`;
        const module = createModuleMock();
        const id = await core.start(module, { name });

        expect(id).toBe(name);
    });

    it(`should allow multiple instances start`, async function () {
        const module = createModuleMock();
        await core.start(module);
        await core.start(module);

        expect(module.started).toBe(2);
    });

    it(`start multiple instances with the same name should throw`, async function () {
        const name = `myName`;
        const module = createModuleMock();
        await core.start(module, { name });

        await expectAsync(
            core.start(module, { name })
        ).toBeRejected();
    });

    it(`should silently proceed if stop is called on something already stopped`, async function () {
        const module = createModuleMock();
        const id = await core.start(module);
        await core.stop(id);
        await core.stop(id);

        expect(module.stopped).toBe(1);
    });


    it(`stop should receive as first argument the return of the start`, async function () {
        const x = Symbol();
        const module = {
            start() {
                return x;
            },
            stop(arg1) {
                expect(arg1).toBe(x);
            },
        };
        const id = await core.start(module);
        await core.stop(id);
    });

    it(`start should receive an emitter to be able to communcicate with other modules`, async function () {
        const module = {
            start(emitter) {
                expect(emitter.on).toBeDefined();
                expect(emitter.off).toBeDefined();
                expect(emitter.emit).toBeDefined();
            },
        };
        await core.start(module);
    });
});
