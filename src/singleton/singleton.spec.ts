// Utilities:
import 'mocha';
import { expect } from 'chai';

// Dependencies:
import 'reflect-metadata';
import { Injectable } from '@angular/core';
import { EnsureError } from '../ensure-error';
import { ResettableSingleton } from './resettable-singleton';

// Under test:
import { Singleton } from './singleton';

describe('@Singleton', () => {
    it('should throw if it is instantiated multiple times', () => {
        @Singleton()
        @Injectable()
        class Service {}

        let singleton = new Service();

        expect(() => {
            let another = new Service();
        }).to.throw(new EnsureError(`
            Service is a singleton and must not be instantiated multiple times.
        `).message);
    });

    it('should update the name of the constructor', () => {
        @Singleton()
        @Injectable()
        class Service {}

        expect(Service.name).to.equal('ServiceSingleton');
        expect(Service.prototype.toString()).to.equal('ServiceSingleton');
    });

    it('should still create an instance of the service', () => {
        @Singleton()
        @Injectable()
        class Service {}

        let singleton = new Service();

        expect(singleton).to.be.an.instanceof(Service);
    });

    it('should still have all the methods of the original service', () => {
        @Singleton()
        @Injectable()
        class Service {
            test () {}
        }

        let singleton = new Service();

        expect(singleton.test).to.be.an.instanceOf(Function);
    });

    it('should be able to be reset', () => {
        @Singleton()
        @Injectable()
        class Service { }

        let singleton = new Service();

        (<ResettableSingleton>Service)._reset();

        expect(() => {
            let singleton = new Service();
        }).not.to.throw();
    });
});
