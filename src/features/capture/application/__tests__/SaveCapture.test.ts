import { createSaveCapture } from "../SaveCapture";

describe('SaveCapture', () => {
    it('persists the photo before saving metadata', async () => {
        const operations: string[] = [];

        const photoStorage = {
            persistTemporaryPhoto: jest.fn(async () => {
                operations.push('photo');
                return 'file:///camerae/originals/photo-001.jpg';
            }),

            deletePersistedPhoto: jest.fn(async () => {}),
        };

        const repository = {
            insert: jest.fn(async () => {
                operations.push('metadata');
            }),
        };

        const saveCapture = createSaveCapture({
            photoStorage,
            repository,
        });

        const capture = await saveCapture({
            id: 'photo-001',
            temporaryImageUri: 'file:///tmp/photo.jpg',
            capturedAt: '2026-10-18T12:00:00Z',
        });

        expect(operations).toEqual(['photo', 'metadata']);

        expect(capture).toEqual({
            id: 'photo-001',
            originalImageUri:
                'file:///camerae/originals/photo-001.jpg',
            capturedAt: '2026-10-18T12:00:00Z',
            referenceCaptureId: null,
        });

        expect(repository.insert).toHaveBeenCalledWith(capture);
    });

    it('removes the persisted photo if metadata insertion fails', async () => {
        const permanentUri = 'file:///camerae/originals/photo-001.jpg';
        
        const photoStorage = {
            persistTemporaryPhoto: jest.fn(async () => permanentUri),
            deletePersistedPhoto: jest.fn(async () => {}),
        };

        const repository = {
            insert: jest.fn(async () => {
                throw new Error('SQLite unavailable');
            }),
        };

        const saveCapture = createSaveCapture({
            photoStorage,
            repository,
        });

        await expect(
            saveCapture({
                id: 'photo-001',
                temporaryImageUri: 'file:///tmp/photo.jpg',
                capturedAt: '2026-10-18T12:00:00Z',
            }),
        ).rejects.toThrow('SQLite unavailable');

        expect(photoStorage.deletePersistedPhoto).toHaveBeenCalledWith(
            permanentUri,
        );

        expect(photoStorage.deletePersistedPhoto).toHaveBeenCalledTimes(1);

    });
});