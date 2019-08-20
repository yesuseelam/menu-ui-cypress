import { TestBed, getTestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { TagService } from './tag.service';
import { Tag } from './tag.model';

describe('Loading Dependencies for Tag Service ', () => {
        let injector;
        let service: TagService;
        let httpMock: HttpTestingController;
      
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TagService]
          });
      
          injector = getTestBed();
          service = injector.get(TagService);
          httpMock = injector.get(HttpTestingController);
        });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
      }));

      describe('#getTags', () => {
        it('should return an Observable<Tag[]>', () => {
          const dummyTags: Tag[] = [
            {tag: "hello", name: "John"},
            {tag: "div", name: "jin"}
                  ];
    
          service.getTags('hello').subscribe(users => {
            expect(users.length).toBe(2);
            expect(users).toEqual(dummyTags);
          });
    
          const req = httpMock.expectOne(`${service.apiURL}/tags/hello`);
          expect(req.request.method).toBe('GET');
          req.flush(dummyTags);
        });
      });




     });