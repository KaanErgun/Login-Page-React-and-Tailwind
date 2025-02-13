import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';

let db: any = null;

export interface User {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

const initDb = async () => {
  if (db) return;

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  // Initialize database with tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if admin user exists, if not create it
  const adminResult = db.exec("SELECT * FROM users WHERE email = 'admin'");
  if (!adminResult.length) {
    const hashedPassword = bcrypt.hashSync('Zamazingo.987', 10);
    db.run(
      'INSERT INTO users (email, password, is_admin) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 1]
    );
  }
};

export const registerUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    await initDb();

    // Check if user exists
    const existingUser = db.exec('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length) {
      return { success: false, message: 'Bu e-posta adresi zaten kullanımda.' };
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const newUser = db.exec(
      'SELECT id, email, is_admin, created_at FROM users WHERE email = ?',
      [email]
    );

    if (newUser.length) {
      return {
        success: true,
        message: 'Kayıt başarıyla tamamlandı.',
        user: {
          id: newUser[0].values[0][0],
          email: newUser[0].values[0][1],
          is_admin: Boolean(newUser[0].values[0][2]),
          created_at: newUser[0].values[0][3]
        }
      };
    }

    return { success: false, message: 'Kayıt işlemi başarısız oldu.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    await initDb();

    const result = db.exec(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!result.length) {
      return { success: false, message: 'E-posta veya şifre hatalı.' };
    }

    const user = {
      id: result[0].values[0][0],
      email: result[0].values[0][1],
      password: result[0].values[0][2],
      is_admin: Boolean(result[0].values[0][3]),
      created_at: result[0].values[0][4]
    };

    if (!bcrypt.compareSync(password, user.password)) {
      return { success: false, message: 'E-posta veya şifre hatalı.' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { 
      success: true,
      message: 'Giriş başarılı.',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
  }
};