# Generated by Django 5.0.7 on 2024-09-03 18:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InsumoView',
            fields=[
                ('tipo', models.CharField(choices=[('Liquido', 'Liquido'), ('Etiqueta', 'Etiqueta'), ('Miscelanea', 'Miscelanea'), ('Paquete', 'Paquete'), ('Envase', 'Envase')], max_length=10)),
                ('nombre', models.CharField(max_length=45, null=True)),
                ('sku', models.CharField(max_length=45, primary_key=True, serialize=False)),
                ('volumen', models.PositiveIntegerField(null=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('stock', models.PositiveIntegerField(null=True)),
            ],
            options={
                'db_table': 'insumos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProductosView',
            fields=[
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45, primary_key=True, serialize=False)),
                ('fragancia', models.CharField(max_length=45, null=True)),
                ('volumen', models.IntegerField(null=True)),
                ('stock', models.IntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
            ],
            options={
                'db_table': 'productos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Envase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45)),
                ('tipo', models.CharField(choices=[('Bidon', 'Bidon'), ('PET', 'PET'), ('Difusor', 'Difusor'), ('Jarabe', 'Jarabe'), ('Colirio', 'Colirio')], max_length=45)),
                ('volumen', models.PositiveIntegerField()),
                ('stock', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
            ],
        ),
        migrations.CreateModel(
            name='Liquido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45)),
                ('tipo', models.CharField(choices=[('Esencia', 'Esencia'), ('Fragancia', 'Fragancia'), ('Agua', 'Agua'), ('Alcohol', 'Alcohol')], max_length=45)),
                ('volumen', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('vencimiento', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Miscelanea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sku', models.CharField(max_length=45)),
                ('nombre', models.CharField(max_length=45)),
                ('tipo', models.CharField(choices=[('Varilla', 'Varilla'), ('Lampara', 'Lampara'), ('Colgante', 'Colgante'), ('Accesorio', 'Accesorio')], max_length=45)),
                ('stock', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('vendible', models.BooleanField(default=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Paquete',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45)),
                ('tipo', models.CharField(choices=[('Caja', 'Caja'), ('Bolsa', 'Bolsa')], max_length=45)),
                ('stock', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
            ],
        ),
        migrations.CreateModel(
            name='Etiqueta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45)),
                ('stock', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('volumen', models.PositiveIntegerField()),
                ('id_liquido', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.liquido')),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=45)),
                ('sku', models.CharField(max_length=45)),
                ('stock', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('id_liquido', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.liquido')),
            ],
        ),
        migrations.CreateModel(
            name='ProductoEnvase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('envase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.envase')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.producto')),
            ],
            options={
                'unique_together': {('producto', 'envase')},
            },
        ),
        migrations.AddField(
            model_name='producto',
            name='envases',
            field=models.ManyToManyField(through='api.ProductoEnvase', to='api.envase'),
        ),
        migrations.CreateModel(
            name='ProductoMiscelanea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('miscelanea', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.miscelanea')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.producto')),
            ],
            options={
                'unique_together': {('producto', 'miscelanea')},
            },
        ),
        migrations.AddField(
            model_name='producto',
            name='miscelaneas',
            field=models.ManyToManyField(through='api.ProductoMiscelanea', to='api.miscelanea'),
        ),
        migrations.CreateModel(
            name='ProductoPaquete',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paquete', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.paquete')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.producto')),
            ],
            options={
                'unique_together': {('producto', 'paquete')},
            },
        ),
        migrations.AddField(
            model_name='producto',
            name='paquetes',
            field=models.ManyToManyField(through='api.ProductoPaquete', to='api.paquete'),
        ),
    ]
