// _______________Установка внешних приложений___________
// npm i nodemon express express-session express-validator express-handlebars
// (https://express-validator.github.io/docs, https://github.com/validatorjs/validator.js)
// npm install mongoose -S  connect-mongodb-session
//  https://www.mongodb.com/  (регистрируемся: Yurkmez, kapl...)
// npm i cors
// npm install bcrypt  (Шифрование паролей)
// npm install csurf cookie-parser body-parser (Защита от уязвимостей)
// https://www.stackhawk.com/blog/node-js-csrf-protection-guide-examples-and-how-to-enable-it/
// npm install connect-flash  (Пакет для работы над ошибками)
// npm install helmet  (защита сервера)
// npm i compression (Пакет для сжатия статических файлов)
// ___________________________________
const express = require('express');
const cors = require('cors');
const path = require('path');
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { format } = require('date-fns');
// __________________________________________
const keys = require('./keys');
const hbsHelper = require('./utils/hbs-helpers');
const varIsAuthMdWare = require('./middleware/variableIsAuth');
const varAdminNameMWare = require('./middleware/variableAdminName');
const varAdminIdMWare = require('./middleware/variableAdminId');

const administratorMiddleware = require('./middleware/administratorMiddleware');
const errorHandler = require('./middleware/error'); // Импорт обработчика ошибки 404
const fileMiddleware = require('./middleware/file'); // Импорт обработчика файлов
const Administrator = require('./models/adminModel');
const Customer = require('./models/customerModel');

// _____Импорт express-handlebars_______
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

//  ________Импорт роутов____________________
// __ Admin _________________________________
const homeRoutes = require('./routes/homeRout');
const addRout = require('./routes/addRout');
// const authRout = require('./routesCustomers/loginRout');
const authadminRout = require('./routes/authadminRout');
const coursesRout = require('./routes/coursesRout');
const basketRoute = require('./routes/basketRout');
const orderRoute = require('./routes/orderRout');
// __ Customer ________________________________
const customerRout = require('./routes/customerRout');

const app = express();
// определяем папку для доступа от всех файлов
app.use(express.static(path.join(__dirname, 'public')));
// extended: true означает, что req.body может содержать любые значения
// см. https://my-js.org/docs/cheatsheet/express-api/
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Хранение сессии в БД. Возвращает класс конструктора (переменная "store")
const MongoStore = require('connect-mongodb-session')(session);
// Создание класса MongoStore
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URL,
});
// Какова логика работы
// При успешной авторизации админа мы в роуте authadminRout:
//  ******* req.session.administrator = candidate;
//  *******  req.session.isAuthenticated = true;
//  *******  req.session.save
// регистрируем id админа в БД
//  И мидлваре app.use(administratorMiddleware)
//  *******  req.administrator = await Administrator.findById(req.session.administrator._id);
// достает его из БД и он становится доступным глобально.
// По завершении сессии мы его удаляем
//  *******  req.session.destroy()
// ____________________________________________
// Настройка session
app.use(
    session({
        secret: keys.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
// Получаем из БД и используем глобально id администратора (в req.administrator)
app.use(administratorMiddleware);

// ***Example***********************
// const todoItems = require('./date/todo-items.json');
// app.get('/date/todo-items', (req, res) => {
//     res.json({ data: todoItems });
// });

// ************** Конфигурирование handlebars: *********************
//  определяем главный файл "main.hbs",
// который должен быть размещен в папке с зарезервированныь названием "layouts"
// определяем расширение для файлов "hbs"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper,
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
//  Helpers
hbs.handlebars.registerHelper('increaseKey', function (key) {
    key += 1;
    return key;
});

hbs.handlebars.registerHelper('dataFormat', function (data) {
    const formattedDate = format(data, 'dd.MM.yyyy');
    return formattedDate;
});

// Регистрация handlebars как движка для рендринга HTML страниц и привязываем его название
//  Здесь - его регистрируем и даем название
app.engine('hbs', hbs.engine);
// Здесь - используем
app.set('view engine', 'hbs');
// указываем папку, где у нас будут храниться наши файлы-шаблоны (основные, типа main.hbs - в layout, общие  - в корневой, т. е. - views, вспомогательные, котрые используются в файле main.hbs, -  в partial. views, layout, partial - зарезервированные названия папок)
//  например можно и так app.set('views', 'pages'), но тогда и нам надо будет создать папку pages
app.set('views', 'views'); // Внутри папки : layout, partial
// single('avatar'): single - это о том, что будет загружаться 1 файл 'avatar' - он будет загружаться в поле avatar в роуте это поле будет использоваться
// После у всех html файлов меняем расширение на "nbs"
// ***********************************

app.use(fileMiddleware.single('avatar'));

// Защита от CSRF
const csrfProtect = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
app.post('/process', parseForm, csrfProtect, function (req, res) {
    res.send('data is being processed');
});
// Работа над ошибками
app.use(flash());
// Защита
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                'img-src': ["'self'", 'https:'],
            },
        },
    })
);
app.use(bodyParser.json());
app.use(compression());
app.use(varIsAuthMdWare);
app.use(varAdminNameMWare);
app.use(varAdminIdMWare);
// Роуты
// - admin
app.use('/', homeRoutes);
app.use('/authadmin', authadminRout);
app.use('/course_add', addRout);
app.use('/courses', coursesRout);
app.use('/basket', basketRoute);
app.use('/orders', orderRoute);

// app.use('/card', cardRoutes);
// - customer
app.use('/customer', customerRout);
// __ обработка ошибок (после подключения всех остальных роутов)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect(
            keys.MONGODB_URL
            //      {
            //     useNewUrlParser: true,
            // }
        );
        console.log('Mongodb connected');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
