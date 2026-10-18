import type { Capture } from '../domain/Capture';

export interface PhotoStorage {
    persistTemporaryPhoto(
        temporaryUri: string,
        captureId: string,
    ): Promise<string>;

    deletePersistedPhoto(originalUri: string): Promise<void>;
}

export interface CaptureRepository {
    insert(capture: Capture): Promise<void>;
}

export interface SaveCaptureInput {
    id: string;
    temporaryImageUri: string;
    capturedAt: string;
    referenceCaptureId?: string | null;
}


export interface SaveCaptureDependencies {
    photoStorage: PhotoStorage;
    repository: CaptureRepository;
}

export function createSaveCapture(
    dependencies: SaveCaptureDependencies,
) {
    return async (input: SaveCaptureInput): Promise<Capture> => {
        const originalImageUri = await dependencies.photoStorage.persistTemporaryPhoto(
            input.temporaryImageUri,
            input.id,
        );

        const capture: Capture = {
            id: input.id,
            originalImageUri,
            capturedAt: input.capturedAt,
            referenceCaptureId: input.referenceCaptureId ?? null,
        };

        try {
            await dependencies.repository.insert(capture);
        } catch (error) {
            try {
                await dependencies.photoStorage.deletePersistedPhoto(originalImageUri);
            } catch (deleteError) {
                console.error('Failed to delete persisted photo:', deleteError);
            }

            throw error;
        }


        return capture;
    };
}