import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private auth = getAuth(this.app);
  
  constructor() {
    // Set persistence to LOCAL - this keeps user logged in even after browser restart
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase auth persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
  }

  // ============ AUTH METHODS ============
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  // ============ PROJECTS CRUD ============
  async getProjects() {
    try {
      console.log('Fetching projects...');
      const projectsCol = collection(this.db, 'projects');
      const projectSnapshot = await getDocs(query(projectsCol, orderBy('order', 'asc')));
      const projects = projectSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      console.log('Projects fetched:', projects.length);
      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  async addProject(project: any) {
    try {
      console.log('Adding project:', project);
      const projectsCol = collection(this.db, 'projects');
      const docRef = await addDoc(projectsCol, project);
      console.log('Project added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: any) {
    try {
      const projectDoc = doc(this.db, 'projects', id);
      await updateDoc(projectDoc, data);
      console.log('Project updated:', id);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string) {
    try {
      const projectDoc = doc(this.db, 'projects', id);
      await deleteDoc(projectDoc);
      console.log('Project deleted:', id);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // ============ SKILLS CRUD ============
  async getSkills() {
    try {
      console.log('Fetching skills from Firebase...');
      const skillsCol = collection(this.db, 'skills');
      const skillSnapshot = await getDocs(query(skillsCol, orderBy('category', 'asc')));
      const skills = skillSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      console.log('Skills fetched:', skills.length);
      return skills;
    } catch (error) {
      console.error('Error getting skills:', error);
      return [];
    }
  }

  async addSkill(skill: any) {
    try {
      console.log('Adding skill:', skill);
      const skillsCol = collection(this.db, 'skills');
      const docRef = await addDoc(skillsCol, skill);
      console.log('Skill added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  async updateSkill(id: string, data: any) {
    try {
      const skillDoc = doc(this.db, 'skills', id);
      await updateDoc(skillDoc, data);
      console.log('Skill updated:', id);
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: string) {
    try {
      const skillDoc = doc(this.db, 'skills', id);
      await deleteDoc(skillDoc);
      console.log('Skill deleted:', id);
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
}