import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

interface Matricula {
  id: string;
  curso: string;
  fecha: string;
  alumno: string;
  sexo: string;
  direccion: string;
  provincia: string;
}

interface Curso {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-web2',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './web2.component.html',
  styleUrls: ['./web2.component.css']
})
export class Web2Component implements OnInit {
  form: FormGroup;
  matriculas: Matricula[] = [];
  cursos: Curso[] = [];
  loadingCursos = false;
  errorMsg = '';
  showErrorModal = false;
  showConfirmModal = false;
  confirmMessage = '';
  // modal tipo (info/error/confirm)
  modalType: 'info' | 'error' | 'confirm' = 'info';

  // UI
  mostrarTabla = true;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      curso: ['', Validators.required],
      fecha: ['', Validators.required],
      alumno: ['', [Validators.required, Validators.minLength(3)]],
      sexo: ['', Validators.required],
      direccion: ['', Validators.required],
      provincia: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.loadCursos();
    // set default fecha today
    const hoy = new Date().toISOString().substring(0, 10);
    this.form.patchValue({ fecha: hoy });
  }

  /* ========== Cursos (select dinámico) ========== */
  loadCursos(): void {
    this.loadingCursos = true;
    this.http.get<Curso[]>('/assets/cursos.json').subscribe({
      next: (list) => {
        this.cursos = list;
        this.loadingCursos = false;
      },
      error: (err) => {
        console.error('Error cargando cursos', err);
        this.loadingCursos = false;
        this.handleError('No se pudieron cargar los cursos. Intentá recargar la página.');
      }
    });
  }

  /* ========== CRUD local (localStorage) ========== */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('matriculas', JSON.stringify(this.matriculas));
    } catch (e) {
      console.error(e);
      this.handleError('Error al guardar en localStorage.');
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const raw = localStorage.getItem('matriculas');
      this.matriculas = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(e);
      this.matriculas = [];
      this.handleError('Error al leer matrículas desde localStorage.');
    }
  }

  addMatricula(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const newMat: Matricula = {
        id: this.generateId(),
        curso: this.form.value.curso,
        fecha: this.form.value.fecha,
        alumno: this.form.value.alumno,
        sexo: this.form.value.sexo,
        direccion: this.form.value.direccion,
        provincia: this.form.value.provincia
      };

      this.matriculas.push(newMat);
      this.saveToLocalStorage();

      // mostrar modal de éxito
      this.modalType = 'info';
      this.confirmMessage = 'Matrícula guardada exitosamente';
      this.showConfirmModal = true;


      this.resetForm();
    } catch (e) {
      console.error(e);
      this.handleError('Error al guardar la matrícula.');
    }
  }

  editarMatricula(id: string): void {
    const m = this.matriculas.find(x => x.id === id);
    if (!m) return;
    this.form.patchValue({
      curso: m.curso,
      fecha: m.fecha,
      alumno: m.alumno,
      sexo: m.sexo,
      direccion: m.direccion,
      provincia: m.provincia
    });
    // borrar la original para que quede como "editar al guardar"
    this.matriculas = this.matriculas.filter(x => x.id !== id);
    this.saveToLocalStorage();
  }

  eliminarMatricula(id: string): void {
    // mostrar modal de confirmación
    this.modalType = 'confirm';
    this.confirmMessage = '¿Estás seguro que querés eliminar esta matrícula?';
    this.showConfirmModal = true;
    // cuando el usuario confirme llamará confirmDelete
    (this as any)._pendingDeleteId = id;
  }

  private confirmDelete(confirmed: boolean): void {
    const id = (this as any)._pendingDeleteId;
    delete (this as any)._pendingDeleteId;
    this.showConfirmModal = false;

    if (!confirmed || !id) return;
    this.matriculas = this.matriculas.filter(x => x.id !== id);
    this.saveToLocalStorage();
    this.modalType = 'info';
    this.confirmMessage = 'Matrícula eliminada';
    this.showConfirmModal = true;
  }

  /* ========== Exportar a PDF / Excel ========== */
  async exportPDF(): Promise<void> {
    if (this.matriculas.length === 0) {
      this.handleError('No hay matrículas para exportar');
      return;
    }

    try {
      // carga dinámica para que npm no sea obligatorio en dev si no se usa
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default ?? (await import('jspdf-autotable'));
      const doc = new jsPDF();

      const headers = [['Alumno', 'Curso', 'Fecha', 'Sexo', 'Provincia']];
      const body = this.matriculas.map(m => [m.alumno, m.curso, m.fecha, m.sexo, m.provincia]);

      // @ts-ignore
      autoTable(doc, { head: headers, body });

      doc.save(`matriculas_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
      this.handleError('Error generando PDF. Asegurate de tener jspdf instalado (npm i jspdf jspdf-autotable).');
    }
  }

  async exportExcel(): Promise<void> {
    if (this.matriculas.length === 0) {
      this.handleError('No hay matrículas para exportar');
      return;
    }

    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(this.matriculas);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Matriculas');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `matriculas_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      this.handleError('Error generando Excel. Asegurate de tener xlsx instalado (npm i xlsx).');
    }
  }

  /* ========== Helpers ========== */
  private generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  public handleError(message: string): void {
    this.errorMsg = message;
    this.modalType = 'error';
    this.showConfirmModal = true;
    // También mostramos un banner pequeño por 5s
    setTimeout(() => this.errorMsg = '', 5000);
  }

  /* ========== Modal callbacks desde el template ========== */
  onModalConfirm(result: boolean): void {
    if (this.modalType === 'confirm') {
      this.confirmDelete(result);
      return;
    }
    // info or error modal: simplemente cerramos
    this.showConfirmModal = false;
  }

  /* ========== Utilidades UI ========= */
  required(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.touched && c.invalid && c.errors?.['required']);
  }

  minLen(controlName: string, len: number): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.touched && c.invalid && c.errors?.['minlength']);
  }

  resetForm() {
    this.form.reset({
      fecha: new Date().toISOString().slice(0, 10)
    });
  }


}
