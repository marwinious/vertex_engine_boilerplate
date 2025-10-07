import { describe, expect, test, expectTypeOf, vi } from 'vitest'
import engine from '../src/engine'
import '../src/engineControllers'

describe('pageData', () => {

    /* let vertex = new Vertex();

    beforeEach(() => {
        vertex = new Vertex();
    }) */

    test('should retrive combined pageData master list', async () => {
        // Create static promise using test data
        // const fetchData = vi.fn(() => Promise.resolve(mockYearOptions))

        const pagesData = await engine.controllers.pages.loadPagesData();

        // console.log({pagesData});
        // console.log(pagesData.pages);
        // console.log('pagesData[0]: ', pagesData.pages[0]);

        expectTypeOf(pagesData).toBeObject();
        expect(pagesData.pages.length).toBeGreaterThan(0);
        expect(pagesData).toHaveProperty('pages');
        expect(pagesData).toHaveProperty('tags');
        expect(pagesData).toHaveProperty('features');
        expect(pagesData).toHaveProperty('adUnits');
        expect(pagesData).toHaveProperty('websites');
        expect(pagesData.pages[0]).toHaveProperty('uri');
        expect(pagesData.pages[0]).toHaveProperty('name');
        expect(pagesData.pages[0]).toHaveProperty('versions');
        expect(pagesData.pages[0]).toHaveProperty('layoutItems');
    })

})