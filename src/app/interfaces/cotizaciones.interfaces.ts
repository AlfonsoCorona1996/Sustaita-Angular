// Generated by https://quicktype.io
// Generated by https://quicktype.io

export interface Cotizaciones {
  data: cot[];
}

export interface Sitios {
  data: sitio[];
}
export interface Equipos {
  data: Equipo_res;
}

export interface Equipo_res{
  _id: string
  Equipos: Equipo[]
}

export interface Refacciones{
  data:Refaccion[]
}

export interface Refaccion{
  _id: string;
  nombre: string;
  part: string;
  tipo: [],
  para:[],
  __v: number;
  equipos: string[];
}

export interface Refaccion_cot{
  nombre: string;
  part: string;
  id_refaccion:string;
  sitio: sitio_combo;
  cant: number;
  install: boolean;
  equipos: string[];
  tipo: [],
  para:[],
  __v: number;
}

export interface cot {
  _id: string;
  folio: string;
  des_cliente: string;
  des_empresa: string;
  empresa: string;
  sitio: string;
  equipos: Equipo[];
  atencion: string;
  remitente: string;
  fecha_sol: Date;
  fecha_pro: Date;
  fecha_cot: Date;
  doc: string;
  vigencia: number;
  status: string;
  __v: number;
}

export interface Equipo {
  id: string;
  marca: string;
  tipo: string;
  modelo: string;
  serie: string;
  capacidad: string;
  refrigerante: string;
  manual: string;
  refacciones: []
}

export interface cot_list {
  folio: string;
  descripcion: string;
  sitio: string;
  fecha_sol: string;
  fecha_pro: string | undefined;
  fecha_cot: string | undefined;
  fecha_cad: string | undefined;
  vigencia: string;
  status: string;
}

export interface cot_larga {
  _id: string;
  folio: string;
  des_corta: string;
  des_larga: string;
  empresa: string;
  sitio: string;
  equipos: Equipo[];
  atencion: string;
  remitente: string;
  fecha_sol: Date;
  fecha_pro: Date;
  fecha_cot: Date;
  fecha_cad: Date;
  doc: string;
  vigencia: string;
  status: string;
  __v: number;
}



export interface permisos {
  categorias: categoria[];
}

export interface categoria{
  viewValue: string,
  show: boolean,
  sub: sub_menu[]
}

export interface sub_menu{
  show: boolean,
  viewValue: string,
  descripcion: string,
  route: string,
  icon: string
}


export interface sitio{
  _id: string;
  empresa: string;
  nombre: string;
  direccion: string;
  coordenadas: string;
  jefes: [];
  Equipos: [];
  __v: number;
}

export interface sitio_combo{
  nombre: string,
  id: string
}

