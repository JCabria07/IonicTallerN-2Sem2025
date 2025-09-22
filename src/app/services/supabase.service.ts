// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = environment.supabaseConfig.supabaseUrl
    const supabaseKey = environment.supabaseConfig.supabaseKey

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  get client() {
    return this.supabase;
  }

  async uploadImage(bucket: string, filePath: string, file: File) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    return data;
  }

  async getPublicUrl(bucket: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }
}
