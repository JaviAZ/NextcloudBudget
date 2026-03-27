<?php

declare(strict_types=1);

namespace OCA\Budget\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/**
 * @template-extends QBMapper<AssetSnapshot>
 */
class AssetSnapshotMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'budget_asset_snaps', AssetSnapshot::class);
	}

	/**
	 * @throws DoesNotExistException
	 */
	public function find(int $id, string $userId): AssetSnapshot {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

		return $this->findEntity($qb);
	}

	/**
	 * Get all snapshots for an asset, ordered by date descending.
	 *
	 * @return AssetSnapshot[]
	 */
	public function findByAsset(int $assetId, string $userId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('asset_id', $qb->createNamedParameter($assetId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->orderBy('date', 'DESC');

		return $this->findEntities($qb);
	}

	/**
	 * Get snapshots for an asset within a date range.
	 *
	 * @return AssetSnapshot[]
	 */
	public function findByAssetInRange(int $assetId, string $userId, string $startDate, string $endDate): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('asset_id', $qb->createNamedParameter($assetId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->gte('date', $qb->createNamedParameter($startDate)))
			->andWhere($qb->expr()->lte('date', $qb->createNamedParameter($endDate)))
			->orderBy('date', 'ASC');

		return $this->findEntities($qb);
	}

	/**
	 * Get the most recent snapshot for an asset.
	 *
	 * @throws DoesNotExistException
	 */
	public function findLatest(int $assetId, string $userId): AssetSnapshot {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('asset_id', $qb->createNamedParameter($assetId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->orderBy('date', 'DESC')
			->setMaxResults(1);

		return $this->findEntity($qb);
	}

	/**
	 * Get all snapshots for all assets belonging to a user within a date range.
	 * Ordered by date ASC, then asset_id ASC.
	 *
	 * @return AssetSnapshot[]
	 */
	public function findAllByUserInRange(string $userId, string $startDate, string $endDate): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->gte('date', $qb->createNamedParameter($startDate)))
			->andWhere($qb->expr()->lte('date', $qb->createNamedParameter($endDate)))
			->orderBy('date', 'ASC')
			->addOrderBy('asset_id', 'ASC');

		return $this->findEntities($qb);
	}

	/**
	 * Get snapshots before a given date for all assets of a user.
	 * Ordered by asset_id ASC, date DESC so caller can deduplicate
	 * to get the latest snapshot per asset before the date.
	 *
	 * @return AssetSnapshot[]
	 */
	public function findLatestBeforeDate(string $userId, string $startDate): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->lt('date', $qb->createNamedParameter($startDate)))
			->orderBy('asset_id', 'ASC')
			->addOrderBy('date', 'DESC');

		return $this->findEntities($qb);
	}

	/**
	 * Delete all snapshots for an asset.
	 */
	public function deleteByAsset(int $assetId, string $userId): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->getTableName())
			->where($qb->expr()->eq('asset_id', $qb->createNamedParameter($assetId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

		$qb->executeStatement();
	}

	/**
	 * Delete all asset snapshots for a user.
	 *
	 * @return int Number of deleted rows
	 */
	public function deleteAll(string $userId): int {
		$qb = $this->db->getQueryBuilder();

		$qb->delete($this->getTableName())
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId, IQueryBuilder::PARAM_STR)));

		return $qb->executeStatement();
	}
}
