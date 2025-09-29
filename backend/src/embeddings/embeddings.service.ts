import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmbeddingsService {
  private client: OpenAI;
  private model = 'text-embedding-3-small'; 

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
  
      return;
    }
    this.client = new OpenAI({ apiKey });
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('OPENAI_API_KEY is not set. Please configure it in your environment.');
    }
  }

  async embedText(text: string): Promise<number[]> {
    this.ensureClient();
    const res = await this.client.embeddings.create({
      model: this.model,
      input: text,
    });
    return res.data[0].embedding as unknown as number[];
  }

  async generateAndStoreInitiativeEmbedding(initiative: {
    id: string;
    title: string;
    description: string;
    theme?: string | null;
    context?: string | null;
    deliverable?: string | null;
    evaluationCriteria?: string | null;
  }) {
    const text = [
      initiative.title,
      initiative.description,
      initiative.theme,
      initiative.context,
      initiative.deliverable,
      initiative.evaluationCriteria,
    ]
      .filter(Boolean)
      .join('\n');

    if (!text) return; 

    try {
      const vector = await this.embedText(text);
      const vectorLiteral = `[${vector.join(',')}]`;
      await this.prisma.$executeRawUnsafe(
        'UPDATE "initiatives" SET "embedding" = $1::vector WHERE id = $2',
        vectorLiteral,
        initiative.id,
      );
    } catch (e) {
    }
  }

  async searchSimilarText(text: string, limit = 10) {
    const vector = await this.embedText(text);
    const vectorLiteral = `[${vector.join(',')}]`;
    
    const rows: Array<{ id: string; distance: number }> = await this.prisma.$queryRawUnsafe(
      `SELECT id, (embedding <-> $1::vector) AS distance
      FROM "initiatives"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <-> $1::vector ASC
      LIMIT $2`,
      vectorLiteral,
      limit,
    );

    return rows;
  }

  async searchSimilarInitiatives(text: string, limit = 10) {
    const idsWithScores = await this.searchSimilarText(text, limit);
    if (!idsWithScores.length) return [];
    const ids = idsWithScores.map((r) => r.id);
    const initiatives = await this.prisma.initiative.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { likes: true, comments: true } } },
    });
    const map = new Map(initiatives.map((i) => [i.id, i]));
    return idsWithScores
      .map(({ id, distance }) => ({ distance, initiative: map.get(id) }))
      .filter((x) => x.initiative);
  }
}