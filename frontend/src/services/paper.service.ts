// Dedicated Paper & Document Viewer Service Layer
// Decouples paper document security and authorization requests from UI DataStore

import { dataStore, type AuthorizedPaperResponse } from '@/services/dataStore';

export class PaperService {
  /**
   * Request authorized paper document access.
   * In Production: Issues an authenticated GET request to Spring Boot:
   * GET /api/v1/papers/{examId}/viewer-token (Returns AWS S3 Presigned URL + Dynamic Watermark Payload)
   */
  static async requestAuthorizedDocument(
    examId: string,
    userRole?: string,
    userEmail: string = 'student@jobsfolder.com'
  ): Promise<AuthorizedPaperResponse> {
    // In Prod: Replace with API Client call `apiClient.get('/api/v1/papers/' + examId + '/access-token')`
    return dataStore.requestAuthorizedDocument(examId, userRole, userEmail);
  }
}
