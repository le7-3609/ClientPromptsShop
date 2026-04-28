import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product-service';
import { environment } from '../../../environments/environment.development';

const PRODUCTS_URL = `${environment.apiUrl}/products`;

const mockProduct = {
  productId: 1,
  subCategoryId: 2,
  productName: 'SEO Prompts',
  subCategoryName: 'SEO',
  categoryName: 'Marketing',
  price: 9.99,
};

describe('ProductService – unit tests', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts() sends GET with position and skip params', async () => {
    const promise = service.getProducts(0, 10);
    const req = httpMock.expectOne(r => r.url === PRODUCTS_URL && r.params.has('position') && r.params.has('skip'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('position')).toBe('0');
    expect(req.request.params.get('skip')).toBe('10');
    req.flush({ items: [mockProduct], total: 1 });
    await promise;
  });

  it('getProducts() appends subCategoryIds when provided', async () => {
    const promise = service.getProducts(0, 10, [1, 2]);
    const req = httpMock.expectOne(r => r.url === PRODUCTS_URL);
    expect(req.request.params.getAll('subCategoryIds')).toEqual(['1', '2']);
    req.flush({ items: [], total: 0 });
    await promise;
  });

  it('getProductsById() sends GET with productId param', async () => {
    const promise = service.getProductsById(1);
    const req = httpMock.expectOne(r => r.url === PRODUCTS_URL && r.params.get('productId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct]);
    const result = await promise;
    expect(result).toEqual([mockProduct] as any);
  });

  it('addProduct() sends POST with product data', async () => {
    const newProduct = { productName: 'New Prompt', price: 4.99 };
    const promise = service.addProduct(newProduct);
    const req = httpMock.expectOne(PRODUCTS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ productId: 99, ...newProduct });
    await promise;
  });

  it('updateProduct() sends PUT to correct URL', async () => {
    const update = { productName: 'Updated' };
    const promise = service.updateProduct(1, update);
    const req = httpMock.expectOne(`${PRODUCTS_URL}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush({});
    await promise;
  });

  it('deleteProduct() sends DELETE to correct URL', async () => {
    const promise = service.deleteProduct(1);
    const req = httpMock.expectOne(`${PRODUCTS_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await promise;
  });
});
