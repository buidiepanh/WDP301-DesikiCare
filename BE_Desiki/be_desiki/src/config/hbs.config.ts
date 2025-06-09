import { join } from 'path';
import exphbs, { engine } from 'express-handlebars';

export const handlebarsConfig = {
  viewsPath: join(process.cwd(), 'src/views'), // Thư mục chứa các template
  publicPath: join(process.cwd(), 'src/public'), // Thư mục chứa file tĩnh (CSS/JS)
  layoutPath: join(process.cwd(), 'src/views/layout'), // Thư mục chứa layout
  defaultLayout: 'layout', // Layout mặc định

  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    custom_concat: (...args) => args.slice(0, -1).join("")
  },
};



export const configureHandlebars = (app) => {
  app.engine('hbs', engine({
      extname: 'hbs',
      //defaultLayout: 'main-layout',
      defaultLayout: false,
      layoutsDir: join(process.cwd(), 'src/views/layout'),
      partialsDir: join(process.cwd(), 'src/views/partials'),
      helpers: {
          section: function (name, options) {
              if (!this._sections) this._sections = {};
              this._sections[name] = options.fn(this);
              return null;
          },
          custom_concat: (...args) => args.slice(0, -1).join(""),
          eq: (a, b) => {
            return a === b
          },
          eqMongoId: (a, b) => {
            return a.toString() === b.toString()
          },
          json: (obj) : string => {
            // console.log(obj);
            // try {
            //   return JSON.stringify(obj, null, 2);
            // } catch (e) {
            //   return 'Invalid JSON';
            // }
            // console.log(JSON.stringify(obj));
            return JSON.stringify(obj);
          }
      }
  }));
  app.set('view engine', 'hbs');
  app.set('views', join(process.cwd(), 'src/views'));
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
};
