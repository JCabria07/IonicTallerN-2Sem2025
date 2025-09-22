export interface IUser {
  uid: string;            // ID único de Firebase
  email: string;          
  displayName?: string;   
  photoURL?: string;      // Foto de perfil (Google)
  emailVerified: boolean; // Estado de verificación del correo
  providerId?: string;    // Proveedor (password, google.com, etc.)
  phoneNumber?: string;   
  createdAt?: Date;       
  lastLogin?: Date;       
}


export type IUserBasicInfo = Pick<IUser, 'email' | 'displayName'>;
