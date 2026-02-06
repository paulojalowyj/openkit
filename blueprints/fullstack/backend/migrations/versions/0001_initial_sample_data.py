"""Initial migration with sample data

Revision ID: 0001
Create Date: 2026-02-03
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'items',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.String(255), nullable=True)
    )
    
    op.bulk_insert(
        'items',
        [
            {'id': 1, 'name': 'Exemplo 1', 'description': 'Item de exemplo criado pela migration'},
            {'id': 2, 'name': 'Exemplo 2', 'description': 'Outro item para teste'},
        ]
    )

def downgrade():
    op.drop_table('items')