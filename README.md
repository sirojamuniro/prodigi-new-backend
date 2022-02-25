Cara pakai
1. buat database bernama prodigi
2. copy folder Prodigi-new-backend
3. buka terminal
4. ketik npm install
5. tunggu proses syncronisasi database untuk pembuatan table sendiri
6. setelah selesai buat seeder
7. buka terminal dan ketik npx sequelize db:seed:all
8. buat file .env bersamaan dengan env.example
9. copy semua env.example ke .env
10. untuk user bisa masuk dengan email:user@example.com password:123456
11. untuk admin bisa masuk dengan email:admin@example.com password:123456
12. untuk menuju halaman admin ketik localhost:9888
13. test api ada di folder collection postman

berikut route yang ada

User
get('user/profile' ProfileController.profile);
put('user/update-profile'ProfileController.update);


put('user/change-upload-photo-profile');
delete('user/delete-upload-photo-profile');

get('user/addresses?start=0&limit=3');
post('user/addresses-input');
put('user/addresses/:id');
delete('user/addresses-delete/:id');

post('user/change-password');
get('user/logout');

post('user/wishlist-input');
get('user/wishlist?start=0&limit=3');
delete('user/wishlist-delete/:id');

post('user/viewproduct');
get('user/viewproduct?start=0&limit=3');

Auth User

post('auth/login');
post('auth/forgot-password');

post('auth/register');
put('auth/register-photo');

post('auth/verify');
post('auth/resend-verify');

Product

get('product/product?start=0&limit=3');
get('product/product-detail?start=0&limit=3');

get('product/product/:id');
get('product/best-product?start=0&limit=3');

post('product/product-max-min?start=0&limit=3');


nb: start dan limit merupakan paginasi
contoh paginasi hanya dimulai dari 2-5 lembar maka start 2 limit 5
paginasi memakai query langsung supaya lebih cepat